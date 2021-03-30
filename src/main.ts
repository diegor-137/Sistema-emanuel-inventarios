import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger()
  const config = app.get(ConfigService)
  const port = parseInt(config.get<string>(SERVER_PORT),10)|| 3000
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true
    })
  )
  await app.listen(port);
  logger.log(`Servidor funcionando en puerto ${await app.getUrl()}`)
  //console.log(`Servidor corriendo en puerto: ${port}`);

}
bootstrap();
