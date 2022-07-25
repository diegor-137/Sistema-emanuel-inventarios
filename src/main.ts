import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';
import { initSwagger } from './app.swagger';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
async function bootstrap() {

  initializeTransactionalContext()
  patchTypeORMRepositoryWithBaseRepository()
  const app = await NestFactory.create(AppModule);
  const logger = new Logger()
  const config = app.get(ConfigService)
  const port = parseInt(config.get<string>(SERVER_PORT),10)|| 3000
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true
    })
  )
  initSwagger(app);
  app.enableCors();
  await app.listen(port);
  logger.log(`Servidor funcionando en puerto ${await app.getUrl()}`)
  //console.log(`Servidor corriendo en puerto: ${port}`);

}
bootstrap();
