import { Module } from '@nestjs/common';
import { CandlesService } from './candles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { CandlesRepository } from './candles.repository';
import { generateCollectionName, getConfig } from '../../shares/helpers/utils';
import { TokenPair } from '../../shares/constants/constant';
import { IndicatorsSchema } from '../indicators/indicators.schema';
import { NatsClientModule } from '../nats-client/nats-client.module';
const config = getConfig();

const tokenPairs = config.get<TokenPair[]>('tokenPairs');
@Module({
  imports: [
    MongooseModule.forFeature(
      tokenPairs.map((pair: TokenPair) => ({
        name: generateCollectionName(pair, DBCollectionName.Indicator),
        schema: IndicatorsSchema,
      })),
    ),
    NatsClientModule,
  ],
  providers: [CandlesService, CandlesRepository],
  exports: [CandlesService, CandlesRepository],
})
export class CandlesModule {}
