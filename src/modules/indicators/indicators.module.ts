import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { IndicatorsSchema } from './indicators.schema';
import { getConfig } from '../../shares/helpers/utils';
const config = getConfig();

const tokenPairs = config.get<string[]>('tokenPairs');
@Module({
  imports: [
    MongooseModule.forFeature([
      tokenPairs.map((pair: string) => ({ name: `${pair}_${DBCollectionName.Indicator}`, schema: IndicatorsSchema })),
    ]),
  ],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
