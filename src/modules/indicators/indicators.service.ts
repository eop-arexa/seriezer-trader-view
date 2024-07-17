import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { SERIEZER_TRADER_VIEW_INJECT_TOKEN } from '../nats-client/nats-client.module';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceEvent, TokenPair } from '../../shares/constants/constant';
import { getConfig, sleep } from '../../shares/helpers/utils';
import { IndicatorsRepository } from './indicators.repository';
import { IndicatorCodes, IndicatorType } from './indicators.constant';
import { IndexFREQIndicatorRequestDto, IndexIndicatorRequestDto } from './indicators.dto';
import { CandleInterval } from '../candles/candles.constant';

const config = getConfig();
const tokenPairs: TokenPair[] = config.get<TokenPair[]>('tokenPairs');

@Injectable()
export class IndicatorsService {
  constructor(
    private readonly indicatorRepository: IndicatorsRepository,
    @Inject(SERIEZER_TRADER_VIEW_INJECT_TOKEN) private natsClient: ClientProxy,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
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
        symbol: 1,
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

    return queryResult.map((doc, index) => {
      if (index + 1 === queryResult.length) {
        return doc;
      }
      delete doc?.calcDetail['nweValues'];
      doc['valuePrediction'] = [];
      return doc;
    });
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
        symbol: 1,
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
