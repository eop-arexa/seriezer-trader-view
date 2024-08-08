import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicators.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { IndicatorsSchema } from './indicators.schema';
import { IndicatorsRepository } from './indicators.repository';
import { generateCollectionName, getConfig } from '../../shares/helpers/utils';
import { TokenPair } from '../../shares/constants/constant';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { CandlesModule } from '../candles/candles.module';
import { IndicatorHistoriesSchema } from './indicator-histories.schema';
import { IndicatorHistoriesRepository } from './indicator-histories.repository';

const config = getConfig();

const tokenPairs = config.get<TokenPair[]>('tokenPairs');

@Module({
  imports: [
    MongooseModule.forFeature([
      ...tokenPairs.map((pair: TokenPair) => ({
        name: generateCollectionName(pair, DBCollectionName.Indicator),
        schema: IndicatorsSchema,
      })),
      ...tokenPairs.map((pair: TokenPair) => ({
        name: generateCollectionName(pair, DBCollectionName.IndicatorHistories),
        schema: IndicatorHistoriesSchema,
      })),
    ]),
    NatsClientModule,
    CandlesModule,
  ],
  controllers: [IndicatorsController],
  providers: [IndicatorsService, IndicatorsRepository, IndicatorHistoriesRepository],
  exports: [IndicatorsService, IndicatorsRepository, IndicatorHistoriesRepository],
})
export class IndicatorsModule {}
