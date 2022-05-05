import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from '@hapi/joi';
import { TypeOrmModule, TypeOrmModuleOptions, } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlmacenModule } from './almacen/almacen.module';
import { RecursosHumanosModule } from './recursos-humanos/recursos-humanos.module';
import { ComprasModule } from './compras/compras.module';
import { VentasModule } from './ventas/ventas.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { TYPEORM_CONFIG } from './config/constants';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      //ser injecta del paquete de nest config para usar el .env
      inject:[ConfigService],
      //se usa para para pasar las variables
      //config:ConfigService nos permite llamar las variables
      useFactory:(config:ConfigService)=>
      config.get<TypeOrmModuleOptions>(TYPEORM_CONFIG),
    }),
    //config module es para activar las variables de entorno
    // el .forRoot() es para indicar es la configuracion maestra
    ConfigModule.forRoot({
      //esto es para no instanciar config en cada modulo
      isGlobal:true,
      load:[databaseConfig],
      //Para indicar donde esta el archivo .ENV
      envFilePath:`.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({ 
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development')
      }),
    }),
    AlmacenModule,
    RecursosHumanosModule,
    ComprasModule,
    VentasModule,
    SucursalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
