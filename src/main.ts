import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    cors({
      origin: 'https://inventario.circuitosinteligentes.com',
    }),
  );

  await app.listen(3000);
}

bootstrap();
