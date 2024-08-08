import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { Connection, Model, QueryOptions } from 'mongoose';
import { IndicatorDocument, IndicatorsSchema } from './indicators.schema';
import { generateCollectionName, getConfig } from '../../shares/helpers/utils';
import { TokenPair } from '../../shares/constants/constant';
import { FreqIndicatorCodes } from './indicators.constant';
import { IndicatorHistoriesSchema } from './indicator-histories.schema';

const config = getConfig();

const tokenPairs = config.get<TokenPair[]>('tokenPairs');

@Injectable()
// tslint:disable-next-line:no-shadowed-variable
export class IndicatorHistoriesRepository {
  models: Map<TokenPair, Model<IndicatorDocument>> = new Map();
  constructor(@InjectConnection() connection: Connection) {
    tokenPairs.forEach((pair: TokenPair) =>
      this.models.set(
        pair,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        connection.model(generateCollectionName(pair, DBCollectionName.IndicatorHistories), IndicatorHistoriesSchema),
      ),
    );
  }

  async findOne(symbol: TokenPair, code: string, start: number, order: number) {
    return this.models
      .get(symbol)
      .findOne({
        uniqueId: `${start}::${order}::${code}`,
      })
      .exec();
  }

  find(symbol: TokenPair, condition: Record<any, any>, projection: object, option: QueryOptions) {
    return this.models.get(symbol).find(condition, projection, option).exec();
  }

  findStream(symbol: TokenPair, condition: Record<any, any>, projection: object, option: QueryOptions) {
    // return this.models
    //   .get(symbol)
    //   .aggregate([
    //     {
    //       $match: condition,
    //     },
    //     {
    //       $project: projection,
    //     },
    //   ])
    //   .cursor();
    return this.models.get(symbol).find(condition, projection, option).cursor();
  }
}
