import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { Connection, Model, QueryOptions } from 'mongoose';
import { generateCollectionName, getConfig } from '../../shares/helpers/utils';
import { TokenPair } from '../../shares/constants/constant';
import { CandleInterval } from './candles.constant';
import { CandleDocument, CandlesSchema } from './candles.schema';

const config = getConfig();

const tokenPairs = config.get<TokenPair[]>('tokenPairs');

@Injectable()
// tslint:disable-next-line:no-shadowed-variable
export class CandlesRepository {
  models: Map<TokenPair, Model<CandleDocument>> = new Map();
  constructor(@InjectConnection() connection: Connection) {
    tokenPairs.forEach((pair: TokenPair) =>
      this.models.set(
        pair,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        connection.model(generateCollectionName(pair, DBCollectionName.Candles), CandlesSchema),
      ),
    );
  }

  latestByInterval(symbol: TokenPair, interval: CandleInterval) {
    return this.models
      .get(symbol)
      .findOne(
        { interval },
        {
          id: 1,
          start: 1,
          end: 1,
          lastEnd: 1,
          op: 1,
          hi: 1,
          lo: 1,
          cl: 1,
          bv: 1,
          qv: 1,
          cnt: 1,
          tbc: 1,
          tqv: 1,
        },
        {
          sort: {
            start: -1,
          },
          lean: true,
        },
      )
      .exec();
  }

  find(symbol: TokenPair, condition: Record<any, any>, option: QueryOptions) {
    return this.models
      .get(symbol)
      .find(
        condition,
        {
          id: 1,
          start: 1,
          end: 1,
          lastEnd: 1,
          op: 1,
          hi: 1,
          lo: 1,
          cl: 1,
          bv: 1,
          qv: 1,
          cnt: 1,
          tbc: 1,
          tqv: 1,
        },
        option,
      )
      .exec();
  }
}
