import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { SERIEZER_TRADER_VIEW_INJECT_TOKEN } from '../nats-client/nats-client.module';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceEvent, TokenPair } from '../../shares/constants/constant';
import { calcIntervalEnd, calcIntervalStart, getConfig, getMinute, sleep } from '../../shares/helpers/utils';
import { IndicatorsRepository } from './indicators.repository';
import {
  adjustIndicatorTimeline,
  IAdjustedTimeFrameIndicator,
  IIndicator,
  IndicatorCodes,
  IndicatorDefDB,
  IndicatorType,
} from './indicators.constant';
import { IndexFREQIndicatorRequestDto, IndexIndicatorRequestDto, IndexIndicatorV2RequestDto } from './indicators.dto';
import { CandleInterval } from '../candles/candles.constant';
import _ from 'lodash';
import { CandlesService } from '../candles/candles.service';
import { IndicatorHistoriesRepository } from './indicator-histories.repository';
import { hrtime } from 'process';

const config = getConfig();
const tokenPairs: TokenPair[] = config.get<TokenPair[]>('tokenPairs');

@Injectable()
export class IndicatorsService {
  constructor(
    private readonly indicatorRepository: IndicatorsRepository,
    private readonly indicatorHistoryRepository: IndicatorHistoriesRepository,
    @Inject(SERIEZER_TRADER_VIEW_INJECT_TOKEN) private natsClient: ClientProxy,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly candleService: CandlesService,
  ) {}

  sendLatestIndicator() {
    IndicatorCodes.forEach((indicatorCode) =>
      this.sendLatestIndicatorByCode(indicatorCode.code, indicatorCode.intervalMinutes),
    );
  }

  async indexIndicator(indexIndicatorFilter: IndexIndicatorRequestDto) {
    this.logger.log(`IndicatorsService::indexIndicator incoming request`);
    const queryResult = await this.indicatorRepository.find(
      indexIndicatorFilter.symbol,
      {
        start: {
          $gte: indexIndicatorFilter.startTime,
          $lte: indexIndicatorFilter.endTime,
        },
        interval: indexIndicatorFilter.interval,
        type: indexIndicatorFilter.type,
      },
      {
        interval: 1,
        start: 1,
        end: 1,
        type: 1,
        code: 1,
        value: 1,
        valuePrediction: 1,
        calcDetail: 1,
        id: 1,
      },
      {
        lean: true,
        sort: {
          start: 1,
        },
        limit: config.get<number>('response.limit'),
      },
    );

    const indicatorCodes: string[] = [];
    try {
      const filteredData = queryResult.reduce((prev, curr) => {
        if (!indicatorCodes.includes(curr.code)) {
          prev[curr.code] = [curr];
          indicatorCodes.push(curr.code);
          return prev;
        }
        prev[curr.code].push(curr);
        return prev;
      }, {});

      return Object.values(filteredData).reduce((prev: any[], curr: any[]) => {
        prev.push(
          ...curr.map((item, index) => {
            if (index + 1 === curr.length) {
              return item;
            }
            delete item?.calcDetail['nweValues'];
            item['valuePrediction'] = [];
            return item;
          }),
        );
        return prev;
      }, []);
    } catch (e) {
      this.logger.error(`IndicatorService::indexIndicator: ${e}`);
    }
  }

  async indexIndicatorV2(indexIndicatorFilter: IndexIndicatorV2RequestDto) {
    this.logger.log(`IndicatorsService::indexIndicatorV2 incoming request`);

    const interval = indexIndicatorFilter.interval;

    const result: IAdjustedTimeFrameIndicator = {
      symbol: indexIndicatorFilter.symbol,
      data: [],
      interval,
    };

    const candles = await this.candleService.aggregateIndicator({
      startTime: indexIndicatorFilter.startTime,
      endTime: indexIndicatorFilter.endTime,
      symbol: indexIndicatorFilter.symbol,
      interval,
    });

    const existingIndicators = await this.indicatorRepository.find(
      indexIndicatorFilter.symbol,
      {
        end: {
          $gte: indexIndicatorFilter.startTime,
        },
        start: {
          $lte: indexIndicatorFilter.endTime,
        },
        type: indexIndicatorFilter.type,
      },
      {
        start: 1,
        end: 1,
        order: 1,
        code: 1,
        value: 1,
        valuePrediction: 1,
        calcDetail: {
          isSignal: 1,
          ...(indexIndicatorFilter.type === IndicatorType.NWE && { lower: 1, upper: 1 }),
        },
      },
      {
        sort: {
          start: -1,
        },
        lean: true,
        batchSize: 500,
      },
    );

    // Order DESC
    const lastIndicator = existingIndicators[0];
    const firstIndicator = existingIndicators[existingIndicators.length - 1];

    const elapsedStart = hrtime();

    const historyCursor = this.indicatorHistoryRepository.findStream(
      indexIndicatorFilter.symbol,
      {
        start: {
          $gte: firstIndicator.start,
          $lte: lastIndicator.end,
        },
        type: indexIndicatorFilter.type,
        order: {
          $mod: [getMinute(indexIndicatorFilter.interval), 0],
        },
      },
      {
        uniqueId: 1,
        calcDetail: {
          isSignal: 1,
          ...(indexIndicatorFilter.type === IndicatorType.NWE && { lower: 1, upper: 1 }),
        },
        value: 1,
        valuePrediction: 1,
      },
      {
        lean: true,
        batchSize: 500,
      },
    );

    const historyMap = {};
    for await (const history of historyCursor) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      historyMap[history.uniqueId] = history;
    }

    const elapsedEnd = hrtime(elapsedStart);
    const processTime = elapsedEnd[0] * 1000 + elapsedEnd[1] / 1000000 + 'ms';
    this.logger.log(`query time: ${processTime}`);

    for (const indicator of existingIndicators) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      indicator.prevData = {};
      for (let i = 1; i <= indicator.order; i++) {
        if (historyMap[`${indicator.start}::${i}::${indicator.code}`]) {
          indicator.prevData[i] = historyMap[`${indicator.start}::${i}::${indicator.code}`];
        }
      }
    }

    const categorizedIndicators = _.groupBy(existingIndicators, 'code');

    //  get data from Indicators
    const indicators: {
      candleIndex: number;
      code: string;
      isSignal: number;
      value: (number | null)[];
      lower?: (number | null)[];
      upper?: (number | null)[];
      // if it has prediction it will have multiple numbers. The index of the item inside the array shows how far from the present
    }[] = [];

    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < IndicatorDefDB.length; j++) {
      const indicatorDef = IndicatorDefDB[j];
      if (indicatorDef.type !== indexIndicatorFilter.type) {
        continue;
      }

      const indicatorData = _.orderBy(
        categorizedIndicators[indicatorDef.code],
        'start',
        'desc',
      ) as unknown as IIndicator[];
      if (indicatorData.length === 0) {
        // indicator not found
        continue;
      }

      const adjustedIndicator = adjustIndicatorTimeline(
        indicatorData,
        candles.length,
        indicatorDef.indicatorParam.offset,
        indicatorDef.interval,
        interval,
        indicatorDef.predictionParam.showOldprediction,
        indexIndicatorFilter.type,
      );
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < adjustedIndicator.length; k++) {
        const adjustedIndicatorItem = adjustedIndicator[k];
        indicators.push({
          candleIndex: adjustedIndicatorItem.candleIndex,
          code: indicatorDef.code,
          isSignal: adjustedIndicatorItem.isSignal,
          value: adjustedIndicatorItem.value,
          ...(indexIndicatorFilter.type === IndicatorType.NWE && {
            upper: adjustedIndicatorItem.upper,
            lower: adjustedIndicatorItem.lower,
          }),
        });
      }
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];

      result.data.push({
        isPrediction: false,
        start: candle.start,
        end: candle.end,
        indicators: [],
      });
    }

    let minCandleIndex = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < indicators.length; i++) {
      const indicator = indicators[i];
      // Gathering completed indicator
      if (indicator.candleIndex >= 0 && indicator.candleIndex < result.data.length) {
        result.data[indicator.candleIndex].indicators.push({
          code: indicator.code,
          isSignal: indicator.isSignal,
          value: indicator.value,
          ...(indexIndicatorFilter.type === IndicatorType.NWE && {
            upper: indicator.upper,
            lower: indicator.lower,
          }),
        });
      }
      minCandleIndex = Math.min(minCandleIndex, indicator.candleIndex);
    }

    let startDate = calcIntervalStart(result.data[0].end + 1, interval);
    let endDate = calcIntervalEnd(startDate, interval);
    for (let i = -1; i >= minCandleIndex; i--) {
      result.data.unshift({
        isPrediction: true,
        start: startDate,
        end: endDate,
        indicators: indicators
          .filter((indicator) => indicator.candleIndex === i)
          .map((item) => ({ code: item.code, isSignal: item.isSignal, value: item.value })),
      });
      startDate = calcIntervalStart(endDate + 1, interval);
      endDate = calcIntervalEnd(startDate, interval);
    }

    return result;
  }

  async indexFREQIndicator(indexFREQIndicatorFilter: IndexFREQIndicatorRequestDto) {
    const queryResult = await this.indicatorRepository.find(
      indexFREQIndicatorFilter.symbol,
      {
        start: {
          $gte: indexFREQIndicatorFilter.startTime,
          $lte: indexFREQIndicatorFilter.endTime,
          ...(indexFREQIndicatorFilter.interval && {
            $mod: [this.getIntervalNumberMinute(indexFREQIndicatorFilter.interval), 0],
          }),
        },
        type: IndicatorType.FREQ,
      },
      {
        interval: 1,
        start: 1,
        end: 1,
        type: 1,
        code: 1,
        value: 1,
        valuePrediction: 1,
        id: 1,
      },
      {
        lean: true,
        sort: {
          start: 1,
        },
        limit: config.get<number>('response.limit'),
      },
    );

    return queryResult.map((doc, index) => {
      if (index + 1 === queryResult.length) {
        return doc;
      }
      doc.valuePrediction = [];
      return doc;
    });
  }

  async sendLatestIndicatorByCode(code: string, intervalMinutes: number) {
    const logger = this.logger;
    while (true) {
      try {
        const latestIndicators = await Promise.all(
          tokenPairs.map((pair) => this.indicatorRepository.latestByCode(pair, code, intervalMinutes)),
        );
        this.natsClient.emit(MicroserviceEvent.INDICATOR_LATEST_ALL, latestIndicators).subscribe({
          next: async () => {
            logger.log(
              `IndicatorsService::sendLatestIndicatorByCode() | Emit event ${MicroserviceEvent.INDICATOR_LATEST_ALL} - ${code}`,
            );
          },
          error(e) {
            logger.error(
              `IndicatorsService::sendLatestIndicatorByCode() | Emit event ${MicroserviceEvent.INDICATOR_LATEST_ALL} error: ${e.message}`,
              e,
            );
          },
        });
        await sleep(Number(config.get('interval.refresh')));
      } catch (e) {
        this.logger.log(`IndicatorsService::sendLatestIndicatorByCode() | error: ${e.message}`, e);
        await sleep(Number(config.get<number>('interval.sleepTime')));
      }
    }
  }

  private getIntervalNumberMinute(interval: CandleInterval): number {
    switch (interval) {
      case CandleInterval.min1:
        return 60000;
      case CandleInterval.min5:
        return 5 * 60000;
      case CandleInterval.min15:
        return 15 * 60000;
      case CandleInterval.min30:
        return 30 * 60000;
      case CandleInterval.min60:
        return 60 * 60000;
      case CandleInterval.min240:
        return 240 * 60000;
      case CandleInterval.min720:
        return 720 * 60000;
      case CandleInterval.min1440:
        return 1440 * 60000;
      default:
        return 60000;
    }
  }
}
