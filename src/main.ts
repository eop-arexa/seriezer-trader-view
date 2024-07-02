import { config as dotenvConfig } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getConfig } from './shares/helpers/utils';
import { AllExceptionsFilter } from './shares/filters/exception.filter';
import { CandlesService } from './modules/candles/candles.service';
import { IndicatorsService } from './modules/indicators/indicators.service';

dotenvConfig();
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

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  await app.listen();
  logger.log(`Seriezer Trader View is running PID: ${process.pid}`);

  const candleService = app.get(CandlesService);
  candleService.sendLatestCandle();
  const indicatorService = app.get(IndicatorsService);
  indicatorService.sendLatestIndicator();
}

// tslint:disable-next-line:no-console
bootstrap().catch((e) => console.error(`SeriezerTraderView::Error: ${e.message}`));
