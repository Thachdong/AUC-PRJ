import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ENABLED VALIDATION PIPE GLOBALLY
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // LOAD SWAGGER DOCUMENTATION FROM CONSOLIDATED YAML FILE
  try {
    const docsPath = path.join(
      process.cwd(),
      'docs',
      'api',
      'openapi-consolidated.yml',
    );
    const yamlContent = fs.readFileSync(docsPath, 'utf8');
    const swaggerDocument = yaml.load(yamlContent) as OpenAPIObject;

    SwaggerModule.setup('api-docs', app, swaggerDocument, {
      jsonDocumentUrl: 'api-docs/json',
      yamlDocumentUrl: 'api-docs/yaml',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    });

    console.log('📚 API Documentation loaded successfully');
    console.log('🔗 Swagger UI: http://localhost:3000/api-docs');
    console.log('📄 JSON API: http://localhost:3000/api-docs/json');
    console.log('📄 YAML API: http://localhost:3000/api-docs/yaml');
  } catch (error) {
    console.warn(
      '⚠️ Could not load YAML documentation:',
      (error as Error).message,
    );
    console.log('📚 Falling back to basic Swagger setup');

    // Fallback: minimal swagger setup
    const fallbackDoc = {
      openapi: '3.0.3',
      info: {
        title: 'AUC API',
        version: '1.0.0',
      },
      paths: {},
    };

    SwaggerModule.setup('api-docs', app, fallbackDoc);
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
