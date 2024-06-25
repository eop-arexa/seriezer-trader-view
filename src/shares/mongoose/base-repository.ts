import { Prop } from '@nestjs/mongoose';
import mongoose, {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  AnyKeys,
  ClientSession,
  CreateOptions,
  SaveOptions,
  PipelineStage,
  InsertManyOptions,
  MongooseUpdateQueryOptions,
  MongooseBaseQueryOptions,
} from 'mongoose';
import { TransactionOptions } from 'mongoose/node_modules/mongodb';
import { slice } from 'lodash';
import { isStringTooLong } from '../helpers/utils';
import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// import { InsertManyOptions } from 'mongoose';

/**
 * https://mongoosejs.com/docs/api.html#model_Model.find
 */
export type ProjectionType = Record<string, number> | string | Array<string>;

interface IBaseRepositorySoftDeleteOptions {
  isSupportSoftDeleted: boolean;
}

type TWithSoftDeleted = {
  isDeleted?: boolean;
  deletedAt?: Date | null;
};

/**
 * Represents a base entity with common fields such as createdAt, updatedAt, id, and _id.
 * @class
 * @property {Date} [createdAt] - The date when the entity was created.
 * @property {Date} [updatedAt] - The date when the entity was last updated.
 * @property {string} id - The unique identifier of the entity.
 * @property {mongoose.Types.ObjectId} _id - The MongoDB ObjectId of the entity.
 */
export class BaseEntity {
  createdAt?: Date;
  updatedAt?: Date;
  id: string;
  _id: mongoose.Types.ObjectId;
}

/**
 * Represents a base schema class that extends BaseEntity.
 * Contains a property 'isDeleted' which defaults to false.
 */
export class BaseSchemaClass extends BaseEntity {
  @Prop({ default: false })
  isDeleted?: boolean;
}

/**
 * Interface that extends the Document interface and includes a field for the document ID.
 * @interface BaseDocument
 * @extends Document
 * @extends TWithSoftDeleted
 * @property {string} id - The ID of the document.
 */
export interface BaseDocument extends Document, TWithSoftDeleted {
  id: string;
}

/**
 * BaseRepository class that serves as a base for other repository classes.
 * @template T - The type of the base document.
 */
export abstract class BaseRepository<T extends BaseDocument> {
  @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService;

  constructor(
    public readonly model: Model<T>,
    public readonly options?: IBaseRepositorySoftDeleteOptions,
  ) {
    this.model = model;
    if (options) {
      this.options = options;
    } else {
      this.options = {
        isSupportSoftDeleted: false,
      };
    }
  }

  async withTransaction<U>(
    fn: (session: ClientSession) => Promise<U>,
    options?: TransactionOptions,
  ): Promise<U | undefined> {
    const session = await this.model.db.startSession();
    try {
      let result: U | undefined;
      await session.withTransaction(async (ses) => {
        result = await fn(ses);
      }, options);
      return result;
    } catch (e) {
      const stringifyError = JSON.stringify(e);
      this.logger.debug({
        data: {
          err: isStringTooLong(stringifyError) ? e['stack'] : e,
          msg: isStringTooLong(stringifyError)
            ? JSON.stringify(e['stack'])
            : stringifyError,
        },
        msg: `Something went wrong with client session`,
        methodName: 'repo.withTransaction',
      });
      throw isStringTooLong(stringifyError) ? 'LOG_BODY_TOO_LARGE' : e;
    } finally {
      session.endSession();
    }
  }

  private getConditionsAfterApplySoftDeleted(
    conditions?: FilterQuery<T>,
    excludeDeleted?: boolean,
  ) {
    const isSupportSoftDeleted = this.getIsSupportSoftDeleted();
    if (isSupportSoftDeleted && excludeDeleted) {
      return {
        isDeleted: false,
        ...conditions,
      };
    }
    return conditions || {};
  }

  public isDeleted(doc: T | null) {
    if (!doc) {
      return true;
    }
    return this.options && this.options.isSupportSoftDeleted && doc.isDeleted === true;
  }

  async findOne(
    conditions?: FilterQuery<T>,
    projection?: ProjectionType,
    options?: QueryOptions<T>,
    excludeDeleted = true,
  ): Promise<T | null> {
    return this.model.findOne(
      this.getConditionsAfterApplySoftDeleted(conditions, excludeDeleted),
      projection,
      options,
    );
  }

  async findById(
    id: any,
    projection?: ProjectionType,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findById(id, projection, options);
  }

  async findMany(
    conditions?: FilterQuery<T>,
    projection?: ProjectionType,
    options?: QueryOptions<T>,
    excludeDeleted = true,
  ) {
    return this.model.find(
      this.getConditionsAfterApplySoftDeleted(conditions, excludeDeleted),
      projection,
      options,
    );
  }

  async exists(
    conditions: FilterQuery<T>,
    excludeDeleted = true,
  ): Promise<ReturnType<Model<T>['exists']>> {
    return this.model.exists(this.getConditionsAfterApplySoftDeleted(conditions, excludeDeleted));
  }

  async countDocuments(criteria: FilterQuery<T>, excludeDeleted = true): Promise<number> {
    return this.model.countDocuments(
      this.getConditionsAfterApplySoftDeleted(criteria, excludeDeleted),
    );
  }

  async createMany(docs: Array<T | AnyKeys<T>>, options?: SaveOptions): Promise<T[]> {
    const isSupportSoftDeleted = this.getIsSupportSoftDeleted();
    if (isSupportSoftDeleted) {
      return this.model.create(
        docs.map((doc) => ({
          isDeleted: false,
          ...doc,
        })),
        options,
      );
    }
    return this.model.create(docs, options);
  }

  async createOne(doc: T | AnyKeys<T>, options?: CreateOptions): Promise<T> {
    const isSupportSoftDeleted = this.getIsSupportSoftDeleted();
    if (isSupportSoftDeleted) {
      return (
        await this.model.create(
          [
            {
              isDeleted: false,
              ...doc,
            },
          ],
          options,
        )
      )[0];
    }
    return (await this.model.create([doc], options))[0];
  }

  async insertMany(
    docs: any[],
    options?: InsertManyOptions,
  ): Promise<ReturnType<(typeof Model<T>)['insertMany']>> {
    return this.model.insertMany(docs, options || {});
  }

  async updateMany(
    conditions: FilterQuery<T>,
    doc: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions<T> | null,
  ): Promise<ReturnType<Model<T>['updateMany']>> {
    return this.model.updateMany(conditions, doc, options);
  }

  async updateOne(conditions: FilterQuery<T>, doc: UpdateQuery<T>, options?: QueryOptions<T>) {
    return this.model.findOneAndUpdate(conditions, doc, {
      new: true,
      ...options,
    });
  }
  async updateById(id: any, doc: UpdateQuery<T>, options?: QueryOptions<T>) {
    return this.updateOne({ _id: id }, doc, options);
  }

  async findByIdAndUpdate(
    id: any,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<ReturnType<(typeof Model<T>)['findByIdAndUpdate']>> {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  async findOneAndUpdate(
    conditions: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
    excludeDeleted = true,
  ): Promise<ReturnType<(typeof Model<T>)['findOneAndUpdate']>> {
    return this.model.findOneAndUpdate(
      this.getConditionsAfterApplySoftDeleted(conditions, excludeDeleted),
      update,
      options,
    );
  }

  async save(doc: T, options?: SaveOptions): Promise<T> {
    return doc.save(options);
  }

  async bulkWrite(
    writes: Parameters<Model<T>['bulkWrite']>[0],
    options: Parameters<Model<T>['bulkWrite']>[1],
  ): Promise<ReturnType<(typeof Model<T>)['bulkWrite']>> {
    return this.model.bulkWrite(writes, options);
  }

  async deleteMany(
    conditions: FilterQuery<T>,
    options?: MongooseBaseQueryOptions<T>,
  ): Promise<ReturnType<Model<T>['deleteMany']>> {
    return this.model.deleteMany(conditions, options);
  }

  async deleteOne(
    conditions: FilterQuery<T>,
    options?,
  ): Promise<ReturnType<Model<T>['deleteOne']>> {
    return this.model.deleteOne(conditions, options);
  }

  async softDeleteOneByDoc(doc: T): Promise<T> {
    const isSupportSoftDeleted = this.getIsSupportSoftDeleted();
    if (!isSupportSoftDeleted) {
      throw new Error(`Schema does not support soft delete`);
    }
    if (doc.isDeleted !== true) {
      doc.isDeleted = true;
      return doc.save();
    }
    return doc;
  }

  aggregate<R>(aggregations?: PipelineStage[], excludeDeleted = true): Promise<R[]> {
    aggregations = slice(aggregations);
    if (excludeDeleted) {
      aggregations.unshift({ $match: { _deleted: { $ne: true } } });
    }

    return this.model.aggregate<R>(aggregations).exec();
  }

  getIsSupportSoftDeleted(): boolean {
    const { isSupportSoftDeleted } = this.options || {};
    return !!isSupportSoftDeleted;
  }
}
