import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CoreModule } from './modules/core/core.module';
import { AllExceptionsFilter } from './shares/filters/exception.filter';
import { QueuesModule } from './modules/queue/queue.module';
import { DatabaseModule } from './modules/database/database.module';
import { CandlesNotifierModule } from './modules/candles/candles.notifier.module';
import { IndicatorsNotifierModule } from './modules/indicators/indicators.notifier.module';

@Module({
  imports: [CoreModule.register(), DatabaseModule, QueuesModule, CandlesNotifierModule, IndicatorsNotifierModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppNotifierModule {}
