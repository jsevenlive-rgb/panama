import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { AppModule } from './app.module';
import { graphqlSchemaToOpenApi } from './service/graphql_openapi';
import * as process from 'process';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { extractor } from './service/version_extractor.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as requestIp from 'request-ip';
import * as basicAuth from 'express-basic-auth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useContainer } from 'class-validator';
import * as express from 'express';
import { getBodyParserOptions } from '@nestjs/platform-express/adapters/utils/get-body-parser-options.util';

dayjs.extend(utc);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use(express.json(getBodyParserOptions(true, { limit: '3mb' })));
  app.use(express.urlencoded(getBodyParserOptions(true, { limit: '3mb' })));
  // inject in validate - https://stackoverflow.com/questions/60062318/how-to-inject-service-to-validator-constraint-interface-in-nestjs-using-class-va
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const origin = process.env.CORS_LIST?.split(',') ?? '*';
  app.enableCors({ origin });

  app.use(requestIp.mw());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.enableVersioning({
    type: VersioningType.CUSTOM,
    extractor,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  //app.useGlobalFilters(new GlobalExceptionFilter());
  if (process.env.SWAGGER_AUTH === 'true') {
    app.use(
      ['/apidoc', '/apidoc-json'],
      basicAuth.default({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      })
    );
  }

  SwaggerModule.setup('apidoc', app, () =>
    graphqlSchemaToOpenApi(app.get(GraphQLSchemaHost).schema)
  );

  app.enableShutdownHooks();
  const port = process.env.PORT || process.env.HTTP_PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
