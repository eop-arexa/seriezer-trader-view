import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { Connection, Model } from 'mongoose';
import { IndicatorDocument, IndicatorsSchema } from './indicators.schema';
import { generateCollectionName, getConfig } from '../../shares/helpers/utils';
import { TokenPair } from '../../shares/constants/constant';
import { CandleInterval } from '../candles/candles.constant';

const config = getConfig();

const tokenPairs = config.get<TokenPair[]>('tokenPairs');

@Injectable()
// tslint:disable-next-line:no-shadowed-variable
export class IndicatorsRepository {
  models: Map<TokenPair, Model<IndicatorDocument>> = new Map();
  constructor(@InjectConnection() connection: Connection) {
    tokenPairs.forEach((pair: TokenPair) =>
      this.models.set(
        pair,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        connection.model(generateCollectionName(pair, DBCollectionName.Indicator), IndicatorsSchema),
      ),
    );
  }

  latestByCode(symbol: TokenPair, code: string) {
    return this.models
      .get(symbol)
      .findOne({ code }, null, {
        sort: {
          start: -1,
        },
      })
      .exec();
  }
}
