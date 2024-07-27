import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import TransformResponseInterceptor from './interceptors/transform-response.interceptor';
import { HttpErrorFilter } from './filters/http-error.filters';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  app.enableCors();

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
 