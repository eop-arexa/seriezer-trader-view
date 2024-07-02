import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { CandlesRepository } from './candles.repository';
import { CandleInterval, ICandle } from './candles.constant';
import { calcIntervalEnd, enumKeys, getConfig } from '../../shares/helpers/utils';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import Decimal from 'decimal.js';
import { CandlesCacheService } from '../memory-cache/candles.cache.service';
import { IndicatorsService } from '../indicators/indicators.service';
import { IndicatorsCacheService } from '../memory-cache/indicators.cache.service';
import { IIndicator } from '../indicators/indicators.constant';
import { IndicatorsRepository } from '../indicators/indicators.repository';

const config = getConfig();

@Injectable()
export class CandlesService {
  constructor(
    private readonly cacheService: CandlesCacheService,
    private readonly candleRepository: CandlesRepository,
    private readonly indicatorRepository: IndicatorsRepository,
    private readonly indicatorService: IndicatorsService,
    private readonly indicatorCacheService: IndicatorsCacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async initMemoryCache() {
    this.logger.log(`CandleService::initMemoryCache | Initialize in memory cache`);
    for (const enumKey of enumKeys(CandleInterval)) {
      const interval = CandleInterval[enumKey];
      this.logger.log(`CandleService::initMemoryCache | Initialize in memory cache | Interval: ${interval}`);
      const candles = await this.candleRepository.findMany(
        {
          interval,
        },
        null,
        {
          sort: { start: -1 },
          limit: config.get('crawler.candleCacheLimit'),
          lean: true,
        },
      );
      this.cacheService.replace(interval, candles);
    }
  }

  async latestCandleByInterval(interval: CandleInterval) {
    const latestFromCache = this.cacheService.getLatestByInterval(interval);
    if (latestFromCache) {
      return latestFromCache;
    }
    return this.candleRepository.findOne(
      {
        interval,
      },
      null,
      {
        sort: { start: -1 },
      },
    );
  }

  async processCandleData(symbol: string, candles: ICandle[]) {
    // Session cache
    const candleInsertToDatabase: Record<CandleInterval, ICandle[]> = {
      '1min': [],
      '5min': [],
      '15min': [],
      '30min': [],
      '60min': [],
      '240min': [],
      '720min': [],
      '1440min': [],
    };

    const candleUpdateToDatabase: Record<CandleInterval, number[]> = {
      '1min': [],
      '5min': [],
      '15min': [],
      '30min': [],
      '60min': [],
      '240min': [],
      '720min': [],
      '1440min': [],
    };

    this.indicatorCacheService.reset();

    for (const candle of candles) {
      // Proceed for each interval
      for (const enumKey of enumKeys(CandleInterval)) {
        const interval = CandleInterval[enumKey];

        if (interval !== CandleInterval.min1 && !candleInsertToDatabase[interval].length) {
          // Getting in-complete calculated candle from DB as single source of truth
          const latestCandle = await this.latestCandleByInterval(interval);
          if (latestCandle && latestCandle.lastEnd < latestCandle.end) {
            // For calculating based on latest one
            candleInsertToDatabase[interval].unshift(latestCandle);
            candleUpdateToDatabase[interval].unshift(latestCandle.start);
          }
        }

        const startDate = candle.start;
        const endDate = calcIntervalEnd(startDate, interval);

        if (interval === CandleInterval.min1 && endDate !== candle.end) {
          this.logger.log(`Warning with candle data, interval mismatch! \n ${JSON.stringify(candle, null, 2)}`);
        }

        // Insert new
        if (candleInsertToDatabase[interval].length === 0) {
          candleInsertToDatabase[interval].unshift({
            symbol: candle.symbol,
            interval,
            start: startDate,
            end: endDate,
            lastEnd: candle.end,
            op: candle.op,
            hi: candle.hi,
            lo: candle.lo,
            cl: candle.cl,
            bv: candle.bv,
            qv: candle.qv,
            cnt: candle.cnt,
            tbv: candle.tbv,
            tqv: candle.tqv,
          });
          // Internal cache update
          this.cacheService.leftPushOne(interval, {
            symbol: candle.symbol,
            interval,
            start: startDate,
            end: endDate,
            lastEnd: candle.end,
            op: candle.op,
            hi: candle.hi,
            lo: candle.lo,
            cl: candle.cl,
            bv: candle.bv,
            qv: candle.qv,
            cnt: candle.cnt,
            tbv: candle.tbv,
            tqv: candle.tqv,
          });

          // Calculate indicator
          await this.indicatorService.calcCurrentIndicators(interval);

          continue;
        }

        // if there is at least one item on cache, we use it...
        const lastKnown = candleInsertToDatabase[interval][0];

        // already done
        if (lastKnown.start >= candle.start) {
          continue;
        }

        // if the given data is already processed onto the given candle data...
        if (lastKnown.lastEnd >= candle.end) {
          continue;
        }

        if (lastKnown.end < candle.start) {
          // akkor pótolni kell, de inkább azt kellene megnézni, hogy az előző is hiőnyzik-e...
        }

        if (lastKnown.end >= candle.end) {
          if (lastKnown.lastEnd < candle.end) {
            // update in cache
            (lastKnown.lastEnd = candle.end),
              (lastKnown.hi = Math.max(lastKnown.hi, candle.hi)),
              (lastKnown.lo = Math.min(lastKnown.lo, candle.lo)),
              (lastKnown.cl = candle.cl),
              (lastKnown.bv = new Decimal(lastKnown.bv).add(candle.bv).toNumber()),
              (lastKnown.qv = new Decimal(lastKnown.qv).add(candle.qv).toNumber()),
              (lastKnown.cnt = new Decimal(lastKnown.cnt).add(candle.cnt).toNumber()),
              (lastKnown.tbv = new Decimal(lastKnown.tbv).add(candle.tbv).toNumber()),
              (lastKnown.tqv = new Decimal(lastKnown.tqv).add(candle.tqv).toNumber());

            // Internal cache update
            this.cacheService.update(interval, lastKnown);
          }
        } else {
          // insert to cache
          // Note that startDate and data.start must be equal.
          if (startDate !== candle.start) {
            this.logger.log(
              `Warning, startDate mismatch! startDate: ${startDate} - data.start: ${candle.start} ${enumKey}`,
            );
          }
          // if not equal we should log like a warning!
          // Internal cache update
          this.cacheService.leftPushOne(interval, {
            symbol: candle.symbol,
            interval,
            start: startDate,
            end: endDate,
            lastEnd: candle.end,
            op: candle.op,
            hi: candle.hi,
            lo: candle.lo,
            cl: candle.cl,
            bv: candle.bv,
            qv: candle.qv,
            cnt: candle.cnt,
            tbv: candle.tbv,
            tqv: candle.tqv,
          });

          candleInsertToDatabase[interval].unshift({
            symbol: candle.symbol,
            interval,
            start: startDate,
            end: endDate,
            lastEnd: candle.end,
            op: candle.op,
            hi: candle.hi,
            lo: candle.lo,
            cl: candle.cl,
            bv: candle.bv,
            qv: candle.qv,
            cnt: candle.cnt,
            tbv: candle.tbv,
            tqv: candle.tqv,
          });
        }
        // // Calculate indicator
        await this.indicatorService.calcCurrentIndicators(interval);
      }
    }

    // Transaction is needed for atomic
    // Promise.all here is an anti practice
    await this.candleRepository.withTransaction(async (session) => {
      const indicatorUpdate = this.indicatorCacheService.getUpdate();
      const indicatorInsert = this.indicatorCacheService.getInsert();
      const bulkInsertCandle: ICandle[] = [];
      const bulkWriteCandle = [];
      for (const enumKey of enumKeys(CandleInterval)) {
        const interval = CandleInterval[enumKey];

        // Insert all min1 candles
        if (interval === CandleInterval.min1) {
          await this.candleRepository.insertMany(candleInsertToDatabase[interval], { session });
          continue;
        }

        for (const candle of candleInsertToDatabase[interval]) {
          // If it's upsert
          if (candleUpdateToDatabase[interval].includes(candle.start)) {
            bulkWriteCandle.push({
              updateOne: {
                filter: {
                  symbol,
                  interval: candle.interval,
                  start: candle.start,
                },
                update: { ...candle },
              },
            });

            continue;
          }
          bulkInsertCandle.push(candle);
        }
      }
      // Mark indicator cache as inserted
      Object.values(indicatorInsert).forEach((indicator: IIndicator) => {
        this.indicatorService.updateCacheInsertIndicator(indicator.interval, indicator.code, indicator);
      });
      // Note: Less insert operation with large bulk takes less time
      await this.candleRepository.insertMany(bulkInsertCandle, { session });
      await this.candleRepository.bulkWrite(bulkWriteCandle, { session });
      await this.indicatorRepository.insertMany(Object.values(indicatorInsert), { session });
      await this.indicatorRepository.bulkWrite(
        Object.values(indicatorUpdate).map((indicator: IIndicator) => ({
          updateOne: {
            filter: {
              code: indicator.code,
              start: indicator.start,
            },
            update: { ...indicator },
          },
        })),
        { session },
      );
    });

    // const endTimer = hrtime(startTimer);
    // this.logger.log(`Candle handling and database timer: ${(endTimer[0] * 1000 + endTimer[1] / 1000000) / 1000} sec`);
  }
}
