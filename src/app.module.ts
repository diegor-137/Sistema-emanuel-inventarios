import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {  DATABASE_HOST, 
          DATABASE_PORT, 
          DATABASE_USERNAME, 
          DATABASE_PASSWORD,  
          DATABASE_NAME } from './config/constants';


import { AlumnoModule } from './alumno/alumno.module';
import { RecursosHumanosModule } from './recursos-humanos/recursos-humanos.module';
import { ComprasModule } from './compras/compras.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      //ser injecta del paquete de nest config para usar el .env
      inject:[ConfigService],
      //se usa para para pasar las variables
      //config:ConfigService nos permite llamar las variables
      useFactory:(config:ConfigService)=>({
        type: 'postgres',
        host:config.get<string>(DATABASE_HOST),
        port: parseInt(config.get<string>(DATABASE_PORT),10),
        username:config.get<string>(DATABASE_USERNAME),
        password:config.get<string>(DATABASE_PASSWORD),
        database:config.get<string>(DATABASE_NAME),
        entities: [__dirname + '../**/**/*entity{.ts,.js'],
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    //config module es para activar las variables de entorno
    // el .forRoot() es para indicar es la configuracion maestra
    ConfigModule.forRoot({
      //esto es para no instanciar config en cada modulo
      isGlobal:true,
      //Para indicar donde esta el archivo .ENV
      envFilePath:'.env'
    }),
    AlumnoModule,
    RecursosHumanosModule,
    ComprasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
