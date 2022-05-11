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
import { AlmacenModule } from './almacen/almacen.module';
import { RecursosHumanosModule } from './recursos-humanos/recursos-humanos.module';
import { ComprasModule } from './compras/compras.module';
import { VentasModule } from './ventas/ventas.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { ProductoSubscriber } from './almacen/producto/subscribers/existencia.subscriber';
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './app.roles';
import { UserModule } from './user/user.module';
import { ConfiguracionesModule } from './configuraciones/configuraciones.module';
import { FinanzasModule } from './finanzas/finanzas.module';

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
        subscribers:[ProductoSubscriber],
        entities: [__dirname + '../**/**/*entity{.ts,.js'],
        autoLoadEntities: true,
        synchronize: true,
        ssl: {rejectUnauthorized: false}
      })
    }),
    //config module es para activar las variables de entorno
    // el .forRoot() es para indicar es la configuracion maestra
    ConfigModule.forRoot({
      //esto es para no instanciar config en cada modulo
      isGlobal:true,
      //Para indicar donde esta el archivo .ENV
      envFilePath:`.env.${process.env.NODE_ENV || 'development'}`
    }),
    AlmacenModule,
    RecursosHumanosModule,
    ComprasModule,
    VentasModule,
    SucursalModule,
    AuthModule,
    AccessControlModule.forRoles(roles),
    UserModule,
    ConfiguracionesModule,
    FinanzasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
