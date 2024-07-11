import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { CandlesRepository } from './candles.repository';
import { getConfig, sleep } from '../../shares/helpers/utils';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceEvent, TokenPair } from '../../shares/constants/constant';
import { CandleInterval } from './candles.constant';
import { ClientProxy } from '@nestjs/microservices';
import { SERIEZER_TRADER_VIEW_INJECT_TOKEN } from '../nats-client/nats-client.module';
import { IndexCandleRequestDto } from './candles.dto';

const config = getConfig();
const tokenPairs: TokenPair[] = config.get<TokenPair[]>('tokenPairs');

@Injectable()
export class CandlesService {
  constructor(
    private readonly candleRepository: CandlesRepository,
    @Inject(SERIEZER_TRADER_VIEW_INJECT_TOKEN) private natsClient: ClientProxy,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  sendLatestCandle() {
    this.sendLatestCandleByInterval(CandleInterval.min1);
    this.sendLatestCandleByInterval(CandleInterval.min5);
    this.sendLatestCandleByInterval(CandleInterval.min15);
    this.sendLatestCandleByInterval(CandleInterval.min30);
    this.sendLatestCandleByInterval(CandleInterval.min60);
    this.sendLatestCandleByInterval(CandleInterval.min240);
    this.sendLatestCandleByInterval(CandleInterval.min720);
    this.sendLatestCandleByInterval(CandleInterval.min1440);
  }

  async indexCandle(indexCandleFilter: IndexCandleRequestDto) {
    return this.candleRepository.find(
      indexCandleFilter.symbol,
      {
        start: {
          $gte: indexCandleFilter.startTime,
          $lte: indexCandleFilter.endTime,
        },
        interval: indexCandleFilter.interval,
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

  async sendLatestCandleByInterval(interval: CandleInterval) {
    const logger = this.logger;
    while (true) {
      try {
        const latestCandles = await Promise.all(
          tokenPairs.map((pair) => this.candleRepository.latestByInterval(pair, interval)),
        );
        this.natsClient.emit(MicroserviceEvent.CANDLE_LATEST_ALL, latestCandles).subscribe({
          next: async () => {
            logger.log(
              `CandlesService::sendLatestCandleByInterval() | Emit event ${MicroserviceEvent.CANDLE_LATEST_ALL} - ${interval}`,
            );
          },
          error(e) {
            logger.error(
              `CandlesService::sendLatestCandleByInterval() | Emit event ${MicroserviceEvent.CANDLE_LATEST_ALL} error: ${e.message}`,
              e,
            );
          },
        });
        await sleep(Number(config.get('interval.refresh')));
      } catch (e) {
        this.logger.log(`CandlesService::sendLatestCandleByInterval() | error: ${e.message}`, e);
        await sleep(Number(config.get<number>('interval.sleepTime')));
      }
    }
  }
}
