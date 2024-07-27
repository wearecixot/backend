import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import TransformResponseInterceptor from './interceptors/transform-response.interceptor';
import { HttpErrorFilter } from './filters/http-error.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new HttpErrorFilter());
  await app.listen(3000);
}
bootstrap();
 