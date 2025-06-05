import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FRONTEND_URL } from '@cover-letter-ai/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
