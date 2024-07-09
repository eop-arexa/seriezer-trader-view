import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { SERIEZER_TRADER_VIEW_INJECT_TOKEN } from '../nats-client/nats-client.module';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceEvent, TokenPair } from '../../shares/constants/constant';
import { getConfig, sleep } from '../../shares/helpers/utils';
import { IndicatorsRepository } from './indicators.repository';
import { IndicatorCalcDetail, IndicatorCodes, IndicatorType } from './indicators.constant';
import { IndexFREQIndicatorRequestDto, IndexIndicatorRequestDto } from './indicators.dto';

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
    IndicatorCodes.forEach((indicatorCode) => this.sendLatestIndicatorByCode(indicatorCode));
  }

  async indexIndicator(indexIndicatorFilter: IndexIndicatorRequestDto) {
    const queryResult = await this.indicatorRepository.find(
      indexIndicatorFilter.symbol,
      {
        start: {
          $gte: indexIndicatorFilter.startTime,
        },
        end: {
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

    return queryResult.map((doc) => {
      delete doc?.calcDetail['nweValues'];
      return doc;
    });
  }

  async indexFREQIndicator(indexFREQIndicatorFilter: IndexFREQIndicatorRequestDto) {
    const queryResult = await this.indicatorRepository.find(
      indexFREQIndicatorFilter.symbol,
      {
        start: {
          $gte: indexFREQIndicatorFilter.startTime,
        },
        end: {
          $lte: indexFREQIndicatorFilter.endTime,
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

    return queryResult.map((doc) => {
      delete doc?.calcDetail['nweValues'];
      return doc;
    });
  }

  async sendLatestIndicatorByCode(code: string) {
    const logger = this.logger;
    while (true) {
      try {
        const latestIndicators = await Promise.all(
          tokenPairs.map((pair) => this.indicatorRepository.latestByCode(pair, code)),
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
}
