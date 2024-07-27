import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import TransformResponseInterceptor from './interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
 