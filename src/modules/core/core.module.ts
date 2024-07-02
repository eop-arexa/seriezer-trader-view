import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { WinstonModule } from 'nest-winston';
import { createTransports, enumerateErrorFormat, timestamp } from '../../shares/helpers/logger';
import winston from 'winston';
import { PaginationHeaderHelper } from '../../shares/pagination/pagination.helper';

@Global()
@Module({})
export class CoreModule {
  static register(): DynamicModule {
    return {
      module: CoreModule,
      providers: [ConfigService, PaginationHeaderHelper],
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
      ],
      exports: [ConfigService, PaginationHeaderHelper],
    };
  }
}
