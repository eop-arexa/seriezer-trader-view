import { JobOptions, RateLimiter } from 'bull';

export interface IQueueJobConfiguration {
  job: JobOptions;
  limiter?: RateLimiter;
}
