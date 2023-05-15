import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_EMPLEADO_NAME, DEFAULT_USER_SUPER_ADMIN, DEFAULT_SUPER_ADMIN_PASSWORD, DEFAULT_EMPLEADO_LASTNAME, DEFAULT_EMPLEADO_EMAIL } from '../config/constants';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/app.roles';

const setDefaultSuperAdmin = async (config: ConfigService) => {
  const userRepository = getRepository<User>(User);

  const defaultUser = await userRepository
    .createQueryBuilder("user")
    .where('user.user = :user', {
        user: config.get<string>(DEFAULT_USER_SUPER_ADMIN),
    })
    .getOne();

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