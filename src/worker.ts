import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.init();
  logger.log(`Worker is running PID: ${process.pid}`);
}

bootstrap();
