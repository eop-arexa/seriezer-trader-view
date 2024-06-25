import { CacheModule, DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtModule } from '@nestjs/jwt';
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
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.getAuthConfiguration().jwt.secretKey,
            signOptions: {
              expiresIn: configService.getAuthConfiguration().jwt.expireTime,
            },
          }),
          inject: [ConfigService],
        }),
        CacheModule.registerAsync({
          useFactory: async (configService: ConfigService) => {
            return {
              store: redisStore,
              host: configService.getRedisConfiguration().host,
              port: configService.getRedisConfiguration().port,
              password: configService.getRedisConfiguration().password,
            };
          },
          inject: [ConfigService],
        }),
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

        ThrottlerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            ttl: config.getThrottleConfiguration().ttl,
            limit: config.getThrottleConfiguration().limit,
            storage: new ThrottlerStorageRedisService(
              new Redis({
                host: config.getRedisConfiguration().host,
                port: config.getRedisConfiguration().port,
                password: config.getRedisConfiguration().password,
              }),
            ),
          }),
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
      exports: [ConfigService, JwtModule, CacheModule, CacheService, PaginationHeaderHelper],
    };
  }
}
