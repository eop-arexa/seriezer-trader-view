import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { Connection, Model, QueryOptions } from 'mongoose';
import { IndicatorDocument, IndicatorsSchema } from './indicators.schema';
import { generateCollectionName, getConfig } from '../../shares/helpers/utils';
import { TokenPair } from '../../shares/constants/constant';

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
        lean: true,
        projection: {
          symbol: 1,
          interval: 1,
          start: 1,
          end: 1,
          type: 1,
          code: 1,
          value: 1,
          valuePrediction: 1,
          calcDetail: 1,
          id: 1,
        },
      })
      .exec();
  }

  find(symbol: TokenPair, condition: Record<any, any>, projection: object, option: QueryOptions) {
    return this.models.get(symbol).find(condition, projection, option).exec();
  }
}
