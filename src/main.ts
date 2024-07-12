import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { NestFactory, Reflector } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getConfig } from './shares/helpers/utils';
import { AllExceptionsFilter } from './shares/filters/exception.filter';
import { MicroserviceInterceptor } from './shares/interceptors/microservice.interceptor';

const config = getConfig();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: [`nats://${config.get('nats.host')}:${config.get('nats.port')}`],
    },
  });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(new MicroserviceInterceptor(logger, reflector));
  await app.listen();
  logger.log(`Seriezer Trader View is running PID: ${process.pid}`);
}

// tslint:disable-next-line:no-console
bootstrap().catch((e) => console.error(`SeriezerTraderView::Error: ${e.message}`));
