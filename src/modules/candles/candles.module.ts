import { Module } from '@nestjs/common';
import { CandlesService } from './candles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { CandlesSchema } from './candles.schema';
import { CandlesRepository } from './candles.repository';
import { IndicatorsModule } from '../indicators/indicators.module';
import { MemoryCacheModule } from '../memory-cache/memory-cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DBCollectionName.Candle, schema: CandlesSchema }]),
    IndicatorsModule,
    MemoryCacheModule,
  ],
  providers: [CandlesService, CandlesRepository],
  exports: [CandlesService, CandlesRepository],
})
export class CandlesModule {}
