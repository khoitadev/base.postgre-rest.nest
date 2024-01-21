import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from '~/app.module';
import { AllExceptionsFilter } from '~/exception/all.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configSwagger = new DocumentBuilder()
    .setTitle('BASE NESTJS')
    .setDescription('REST API')
    .setVersion('1.0')
    .addTag('base')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, configSwagger, options);
  SwaggerModule.setup('api', app, document);

  const PORT: number | string = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  await app.listen(PORT);
  console.log('Nestjs listening port: ', PORT);
}
bootstrap();
