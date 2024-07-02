import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
import { CoreModule } from './modules/core/core.module';
import { AllExceptionsFilter } from './shares/filters/exception.filter';
import { QueuesModule } from './modules/queue/queue.module';
import { DatabaseModule } from './modules/database/database.module';
import { IndicatorsModule } from './modules/indicators/indicators.module';
import { CandlesModule } from './modules/candles/candles.module';

@Module({
  imports: [CoreModule.register(), DatabaseModule, QueuesModule, IndicatorsModule, CandlesModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
