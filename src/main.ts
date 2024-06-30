import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { env } from './config';

async function bootstrap() {
  const logger = new Logger(`Main`);
  const app = await NestFactory.create(AppModule); 

  app.setGlobalPrefix('api')

  //Validacion GlobalPipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      /*Convertir al tipo de dato esperado los DTO*/
      transform: true,
      transformOptions:{
        enableImplicitConversion: true,
      }
    })
  );  
  await app.listen(env.port);
  logger.log(`Servidor corriendo en el puerto ${env.port}`);
}
bootstrap();
