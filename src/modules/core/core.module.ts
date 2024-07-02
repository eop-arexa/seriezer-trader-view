import { CacheModule, DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CacheService } from './cache.service';
import { WinstonModule } from 'nest-winston';
import { createTransports, enumerateErrorFormat, timestamp } from '../../shares/helpers/logger';
import winston from 'winston';
import { PaginationHeaderHelper } from '../../shares/pagination/pagination.helper';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import Redis from 'ioredis';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { QueuePrefixKey } from '../queue/queue.constant';

@Global()
@Module({})
export class CoreModule {
  static register(): DynamicModule {
    return {
      module: CoreModule,
      providers: [ConfigService, CacheService, PaginationHeaderHelper],
      imports: [
        WinstonModule.forRootAsync({
          useFactory: async (configService: ConfigService) => {
            const transports = createTransports(
              configService.getLoggerConfiguration().useFile,
              configService.getAppName(),
              configService.getEnvironment(),
            );
            return {
              level: 'info',
              format: winston.format.combine(timestamp(), enumerateErrorFormat()),
              transports,
            };
          },
          inject: [ConfigService],
        }),

        BullModule.forRootAsync({
          useFactory: async (configService: ConfigService) => {
            return {
              redis: {
                host: configService.getRedisConfiguration().host,
                port: configService.getRedisConfiguration().port,
                password: configService.getRedisConfiguration().password,
              },
              prefix: QueuePrefixKey,
            };
          },
          inject: [ConfigService],
        }),
      ],
      exports: [ConfigService, CacheService, PaginationHeaderHelper],
    };
  }
}
