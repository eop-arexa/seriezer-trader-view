import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shares/mongoose/base-repository';
import { UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DBCollectionName } from '../database/database.const';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(DBCollectionName.User)
    model: Model<UserDocument>,
  ) {
    super(model, {
      isSupportSoftDeleted: true,
    });
  }
}
