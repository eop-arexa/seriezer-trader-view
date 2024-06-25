import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { NestFactory } from '@nestjs/core';
import { AppModule, modules } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from 'src/shares/filters/http-exception.filter';
import { getConfig } from './shares/helpers/utils';
const config = getConfig();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = config.get('app');
  const { host, port, url } = appConfig;
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // To use class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  setupSwagger(app, url);
  await app.listen(port, host, async () => {
    logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
function setupSwagger(app: INestApplication, serverUrl?: string) {
  const tags = collectApiTags();

  const options = new DocumentBuilder()
    .setTitle(config.get('app.name'))
    .setDescription(config.get('app.brandName'))
    .addServer(serverUrl)
    .setVersion(`1.0`)
    .addBearerAuth()
    .addBasicAuth();

  tags.forEach((tag) => {
    options.addTag(tag);
  });

  const optionsSwagger = options.build();
  const document = SwaggerModule.createDocument(app, optionsSwagger);

  try {
    const outputSwaggerFile = `${process.cwd()}/output-specs/swagger.json`;
    if (!fs.existsSync(`${process.cwd()}/output-specs`)) {
      fs.mkdirSync(`${process.cwd()}/output-specs`);
    }
    fs.writeFileSync(outputSwaggerFile, JSON.stringify(document, null, 2), { encoding: 'utf-8' });
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.warn(`Could not save swagger docs into file`, e);
  }
  SwaggerModule.setup('/docs', app, document, {
    customSiteTitle: config.get('app.name'),
    swaggerOptions: {
      tagsSorter: 'alpha',
      displayOperationId: true,
      persistAuthorization: true,
    },
  });
}

function collectApiTags() {
  let tags = [];
  for (const module of modules) {
    const controllers = Reflect.getMetadata('controllers', module);
    if (!controllers?.length) {
      continue;
    }
    for (const controller of controllers) {
      const apiTags = Reflect.getMetadata('swagger/apiUseTags', controller);
      if (apiTags?.length) {
        tags = tags.concat(apiTags);
      }
    }
  }
  tags.sort();

  return tags;
}
bootstrap();
