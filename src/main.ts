import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, SERVER_PORT } from './config/constants';
import { initSwagger } from './app.swagger';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
import { config as awsConfig } from 'aws-sdk';
import setDefaultSuperAdmin from './scripts/superadmin-default';
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
  setDefaultSuperAdmin(config)
  app.enableCors();
  await app.listen(port);
  awsConfig.update({
    credentials: {
      accessKeyId: config.get<string>(AWS_ACCESS_KEY_ID),
      secretAccessKey: config.get<string>(AWS_SECRET_ACCESS_KEY)
    },
    region: config.get<string>(AWS_REGION)
  });

  logger.log(`Servidor funcionando en puerto ${await app.getUrl()}`)
  //console.log(`Servidor corriendo en puerto: ${port}`);

}
bootstrap();
