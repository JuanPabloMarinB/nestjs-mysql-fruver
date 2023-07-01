import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app.module';
import * as express from 'express';



const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());

  // Resto de la configuración de tu aplicación

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
