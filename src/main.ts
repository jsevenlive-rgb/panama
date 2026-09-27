import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as process from 'process';
import { VersioningType } from '@nestjs/common';
import { extractor } from './service/version_extractor.service';
import { I18nValidationPipe } from 'nestjs-i18n';
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
    new I18nValidationPipe({
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
      ['/apidoc', '/apidoc-json', '/site/apidoc', '/site/apidoc-json'],
      basicAuth.default({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      })
    );
  }

  setup_swagger(app, 'apidoc');
  setup_swagger(app, 'site/apidoc', 'site');

  app.enableShutdownHooks();
  await app.listen(process.env.HTTP_PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

function setup_swagger(app, route = 'help', folder = null) {
  const site_api = new DocumentBuilder()
    .setTitle('Backend')
    .setDescription('API')
    .addBearerAuth()
    .setVersion('3')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
        description: 'API Key For External calls',
      },
      'X-API-KEY'
    )
    .build();

  const document_site = SwaggerModule.createDocument(app, site_api);

  const recursiveSchemaPropScan = (existing_schemas: Array<string>, property_document: any): Array<string> => {
    let adding_schema = [];
    for (const prop_name in property_document) {
      const prop = property_document[prop_name];
      if (prop.items && prop.items.$ref) {
        const schemaName = prop.items.$ref.split('/').reverse()[0];
        if (!existing_schemas.includes(schemaName)) {
          adding_schema.push(schemaName);
        }
      }
      if (prop.$ref) {
        const schemaName = prop.$ref.split('/').reverse()[0];
        if (!existing_schemas.includes(schemaName)) {
          adding_schema.push(schemaName);
        }
      }

      //For arrays
      for (const param of ['allOf', 'oneOf', 'anyOf']) {
        if (prop[param]) {
          for (const schema_ref of prop[param]) {
            if (schema_ref.$ref) {
              const schemaName = schema_ref.$ref.split('/').reverse()[0];
              if (!existing_schemas.includes(schemaName)) {
                adding_schema.push(schemaName);
              }
            }
            if (schema_ref.properties) {
              adding_schema = adding_schema.concat(recursiveSchemaPropScan(existing_schemas, schema_ref.properties));
            }
          }
        }
      }

      if (prop.properties) {
        adding_schema = adding_schema.concat(recursiveSchemaPropScan(existing_schemas, prop.properties));
      }
    }
    return adding_schema;
  };

  const recursiveSchemaScan = (
    document: OpenAPIObject,
    existing_schemas: Array<string>,
    new_schemas: Array<string>
  ) => {
    let adding_schema = [];

    existing_schemas = existing_schemas.concat(new_schemas);

    const schemas = document.components?.schemas ?? {};
    for (const schema_name of new_schemas) {
      const schema = schemas[schema_name];
      if (!schema?.['properties']) continue;
      adding_schema = adding_schema.concat(recursiveSchemaPropScan(existing_schemas, schema['properties']));
    }

    if (adding_schema.length > 0) {
      existing_schemas = existing_schemas.concat(adding_schema);
      return recursiveSchemaScan(document, existing_schemas, adding_schema).concat(existing_schemas);
    }

    return existing_schemas;
  };
  SwaggerModule.setup(route, app, document_site, {
    explorer: true,
    patchDocumentOnRequest: (req, _res, document) => {
      let enabled_schema = [];
      const copyDocument = JSON.parse(JSON.stringify(document));
      if (folder === null) return copyDocument;

      for (const route in document.paths) {
        if (route.startsWith(`/${folder}`)) {
          for (const type_request in copyDocument.paths[route]) {
            const operation = copyDocument.paths[route][type_request];

            if (operation.requestBody?.content) {
              for (const type in operation.requestBody.content) {
                const content = operation.requestBody.content[type];
                enabled_schema = recursiveSchemaPropScan(enabled_schema, content).concat(enabled_schema);
              }
            }
            if (operation.parameters) {
              for (const code in operation.parameters) {
                enabled_schema = recursiveSchemaPropScan(enabled_schema, operation.parameters[code]).concat(
                  enabled_schema
                );
              }
            }
            if (operation.responses) {
              for (const code in operation.responses) {
                const response = operation.responses[code];
                if (!response?.content) continue;
                for (const type in response.content) {
                  const content = response.content[type];
                  enabled_schema = recursiveSchemaPropScan(enabled_schema, content).concat(enabled_schema);
                }
              }
            }
          }
        } else {
          delete copyDocument.paths[route];
        }
      }

      enabled_schema = recursiveSchemaScan(copyDocument, [], enabled_schema);

      if (copyDocument.components?.schemas) {
        for (const schema in copyDocument.components.schemas) {
          if (!enabled_schema.includes(schema)) {
            delete copyDocument.components.schemas[schema];
          }
        }
      }
      return copyDocument;
    },
  });
}

bootstrap();
