import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shares/mongoose/base-repository';
import { InjectModel } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { Model } from 'mongoose';
import { CandleDocument } from './candles.schema';

@Injectable()
export class CandlesRepository extends BaseRepository<CandleDocument> {
  constructor(
    @InjectModel(DBCollectionName.Candle)
    model: Model<CandleDocument>,
  ) {
    super(model);
  }
}
