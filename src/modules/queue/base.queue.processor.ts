import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { LoggerService } from '@nestjs/common';

export class BaseQueueProcessor {
  protected readonly logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`, job.data);
  }

  @OnQueueError()
  onError(job: Job) {
    this.logger.error(`Error job ${job.id} of type ${job.name}`, job.data);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(`Failed job ${job.id} of type ${job.name} for reason: ${err}`, job.data, err);
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(`Complete job ${job.id} of type ${job.name}`, job.data);
  }
}
