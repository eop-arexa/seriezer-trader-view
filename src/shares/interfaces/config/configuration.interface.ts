import { IAppConfiguration } from 'src/shares/interfaces/config/app-configuration.interface';
import { IStorageConfiguration } from 'src/shares/interfaces/config/storage-configuration.interface';
import { IThrottleConfiguration } from 'src/shares/interfaces/config/throttle-configuration.interface';
import { IAuthConfiguration } from './auth-configuration.interface';
import { ILoggerConfiguration } from './logger-configuration.interface';
import { IQueueJobConfiguration } from './queue-job-configuration.interface';
import { IRedisConfiguration } from './redis-configuration.interface';
import { IMongoConfiguration } from './mongodb-configuration.interface';

export interface IConfiguration {
  app: IAppConfiguration;
  auth: IAuthConfiguration;
  logger: ILoggerConfiguration;
  redis: IRedisConfiguration;
  mongodb: IMongoConfiguration;
  storage: IStorageConfiguration;
  throttle: IThrottleConfiguration;
  queue_job: IQueueJobConfiguration;
}
