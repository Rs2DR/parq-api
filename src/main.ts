import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  StandardSchemaSerializerInterceptor,
  StandardSchemaValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSchema } from 'zod-openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.useGlobalInterceptors(
    new StandardSchemaSerializerInterceptor(app.get(Reflector)),
  );

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);

  const config = new DocumentBuilder()
    .setTitle('Park API')
    .setDescription('The API for park application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter the JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const documentOptions: SwaggerDocumentOptions = {
    standardSchemaConverter: (schema, { schemaType }) => {
      const converted = createSchema(schema as never, {
        io: schemaType,
        openapiVersion: '3.0.0',
      });
      return { schema: converted.schema, components: converted.components };
    },
  };

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, documentOptions);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}
await bootstrap();
