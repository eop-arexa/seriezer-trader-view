import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { SERIEZER_TRADER_VIEW_INJECT_TOKEN } from '../nats-client/nats-client.module';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceEvent, TokenPair } from '../../shares/constants/constant';
import { getConfig, sleep } from '../../shares/helpers/utils';
import { IndicatorsRepository } from './indicators.repository';
import { IndicatorCodes, IndicatorType } from './indicators.constant';
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
    IndicatorCodes.map((indicatorCode) => this.sendLatestIndicatorByCode(indicatorCode));
  }

  async indexIndicator(indexIndicatorFilter: IndexIndicatorRequestDto) {
    return this.indicatorRepository.find(
      indexIndicatorFilter.symbol,
      {
        start: {
          $gte: indexIndicatorFilter.startTime,
        },
        ...(indexIndicatorFilter.endTime && {
          end: {
            $lte: indexIndicatorFilter.endTime,
          },
        }),
        interval: indexIndicatorFilter.interval,
        type: { $ne: IndicatorType.FREQ },
      },
      {
        lean: true,
        sort: {
          start: 1,
        },
        limit: config.get<number>('response.limit'),
      },
    );
  }

  async indexFREQIndicator(indexFREQIndicatorFilter: IndexFREQIndicatorRequestDto) {
    return this.indicatorRepository.find(
      indexFREQIndicatorFilter.symbol,
      {
        start: {
          $gte: indexFREQIndicatorFilter.startTime,
        },
        ...(indexFREQIndicatorFilter.endTime && {
          end: {
            $lte: indexFREQIndicatorFilter.endTime,
          },
        }),
        type: IndicatorType.FREQ,
      },
      {
        lean: true,
        sort: {
          start: 1,
        },
      },
    );
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
