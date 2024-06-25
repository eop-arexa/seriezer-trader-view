import { INestApplicationContext, LoggerService } from '@nestjs/common';
import * as momentTz from 'moment-timezone';
import { Cache } from 'cache-manager';
import { NestFactory } from '@nestjs/core';
import os from 'os';

export abstract class BaseCron {
  protected readonly lockKey: string;
  private holdingLock: boolean;

  constructor(
    protected readonly logger: LoggerService,
    protected readonly cacheManager: Cache,
    private readonly baseLockKey: string,
  ) {
    this.lockKey = `${this.baseLockKey}-${momentTz.tz(Date.now(), 'Asia/Singapore').format('YYYYMMDD')}`;
  }

  async run(runByCronjob = true): Promise<void> {
    try {
      await this.init();
      await this.process();
      await this.endSucceeded(runByCronjob);
    } catch (err) {
      await this.endFailed(err, runByCronjob);
    }
  }

  async init(): Promise<void> {
    await this.tryToLock();
    this.logger.log(`${this.constructor.name} cron started`);
  }

  abstract process(): Promise<void>;

  async endSucceeded(runByCronjob = true): Promise<void> {
    await this.tryToUnlock();
    this.logger.log(`${this.constructor.name} cron successfully finished`);
    if (runByCronjob) {
      process.exit();
    }
  }

  async endFailed(err: any, runByCronjob = true): Promise<void> {
    await this.tryToUnlock();
    this.logger.error({ message: String(err), err, json: JSON.stringify(err) });
    this.logger.log(`${this.constructor.name} cron failed`);
    if (runByCronjob) {
      process.exit(-1);
    }
  }

  async tryToLock(): Promise<void> {
    const hostName = os.hostname();
    const locked = await this.cacheManager.get(this.lockKey);

    // Avoid race conditional
    if (locked && locked !== hostName) {
      this.logger.log(`hostName: ${hostName}, lock key: ${this.lockKey}, lock value: ${locked}`);
      throw new Error(`${this.lockKey} is being locked by ${locked}`);
    }

    await this.cacheManager.set(this.lockKey, hostName);
    this.holdingLock = true;
    this.logger.log(`${this.constructor.name} acquired lock ${this.lockKey}`);
  }

  async tryToUnlock(): Promise<void> {
    if (this.holdingLock) {
      await this.cacheManager.del(this.lockKey);
      this.holdingLock = false;
      this.logger.log(`${this.constructor.name} released lock ${this.lockKey}`);
    }
  }
}

export async function createCronContext(module): Promise<INestApplicationContext> {
  process.on('uncaughtException', (reason) => console.error(reason, `uncaughtException, reason: ${reason}`));
  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason, `Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });

  try {
    return await NestFactory.create(module);
  } catch (err) {
    this.logger.error(err, 'Can not create application context');
    process.exit(-1);
  }
}
