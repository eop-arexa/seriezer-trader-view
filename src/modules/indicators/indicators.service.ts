import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { SERIEZER_TRADER_VIEW_INJECT_TOKEN } from '../nats-client/nats-client.module';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceEvent, TokenPair } from '../../shares/constants/constant';
import { getConfig, sleep } from '../../shares/helpers/utils';
import { IndicatorsRepository } from './indicators.repository';
import { IndicatorCodes } from './indicators.constant';

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

  async sendLatestIndicatorByCode(code: string) {
    const logger = this.logger;
    while (true) {
      try {
        const latestIndicators = await Promise.all(
          tokenPairs.map((pair) => this.indicatorRepository.latestByCode(pair, code)),
        );
        this.natsClient.emit(MicroserviceEvent.INDICATOR_LATEST_ALL, latestIndicators).subscribe({
          error(e) {
            logger.error(
              `CandlesService::sendLatestIndicatorByCode() | Emit event ${MicroserviceEvent.INDICATOR_LATEST_ALL} error: ${e.message}`,
              e,
            );
          },
        });
        await sleep(Number(config.get('interval.refresh')));
      } catch (e) {
        this.logger.log(`CandlesService::sendLatestIndicatorByCode() | error: ${e.message}`, e);
        await sleep(Number(config.get<number>('interval.sleepTime')));
      }
    }
  }
}
