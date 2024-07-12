import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { NestFactory, Reflector } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getConfig } from './shares/helpers/utils';
import { AllExceptionsFilter } from './shares/filters/exception.filter';
import { CandlesService } from './modules/candles/candles.service';
import { IndicatorsService } from './modules/indicators/indicators.service';
import { MicroserviceInterceptor } from './shares/interceptors/microservice.interceptor';
import { AppNotifierModule } from './app.notifier.module';

const config = getConfig();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppNotifierModule, {
    transport: Transport.NATS,
    options: {
      servers: [`nats://${config.get('nats.host')}:${config.get('nats.port')}`],
    },
  });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const reflector = app.get(Reflector);
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(new MicroserviceInterceptor(logger, reflector));
  await app.listen();
  logger.log(`Seriezer Trader View Notifier is running PID: ${process.pid}`);
  const candleService = app.get(CandlesService);
  candleService.sendLatestCandle();
  const indicatorService = app.get(IndicatorsService);
  indicatorService.sendLatestIndicator();
}

// tslint:disable-next-line:no-console
bootstrap().catch((e) => console.error(`SeriezerTraderViewNotifier::Error: ${e.message}`));
