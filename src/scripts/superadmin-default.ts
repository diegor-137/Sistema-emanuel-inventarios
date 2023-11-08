import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_EMPLEADO_NAME, DEFAULT_USER_SUPER_ADMIN, DEFAULT_SUPER_ADMIN_PASSWORD, DEFAULT_EMPLEADO_LASTNAME, DEFAULT_EMPLEADO_EMAIL } from '../config/constants';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/app.roles';
import { TipoTransaccion } from 'src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity';
//import { TipoTranssacion } from 'src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity';

const setDefaultSuperAdmin = async (config: ConfigService) => {
  const userRepository = getRepository<User>(User);
  const tipoTransaccionRepository = getRepository<TipoTransaccion>(TipoTransaccion)

  const defaultUser = await userRepository
    .createQueryBuilder("user")
    .where('user.user = :user', {
        user: config.get<string>(DEFAULT_USER_SUPER_ADMIN),
    })
    .getOne();

  const defaultTipoTransaccion = await tipoTransaccionRepository
    .createQueryBuilder("tipo_transaccion") 
    .getMany();
  
  if(!defaultTipoTransaccion){
    const tipoTransaccion = tipoTransaccionRepository.create([
      {id:1, nombre: 'Efectivo'},
      {id:2, nombre: 'Tarjeta'},
      {id:3, nombre: 'Cheque'},
      {id:4, nombre: 'Transferencia'}
    ])
    return await tipoTransaccionRepository.save(tipoTransaccion);
  }

  if (!defaultUser) {
    console.log('Usuario super admin creado');    
    const adminUser = userRepository.create({
      id: 1,  
      user: config.get<string>(DEFAULT_USER_SUPER_ADMIN),
      password: config.get<string>(DEFAULT_SUPER_ADMIN_PASSWORD),
      roles: [Role.SUPERADMIN],
      empleado: {
        id:1,
        nombre: config.get<string>(DEFAULT_EMPLEADO_NAME),
        apellido: config.get<string>(DEFAULT_EMPLEADO_LASTNAME),
        email: config.get<string>(DEFAULT_EMPLEADO_EMAIL),
      }
    });

    return await userRepository.save(adminUser);
  }
};

export default setDefaultSuperAdmin; 