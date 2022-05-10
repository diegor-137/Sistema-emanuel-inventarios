import { RolesBuilder } from 'nest-access-control';

export enum Role {
  ADMIN = 'ADMIN',
  EMPLEADO = 'EMPLEADO',
  BODEGUERO = 'BODEGUERO'
}

export enum Recurso {
  EMPLEADO = 'EMPLEADO',
  VENTA = 'VENTA',
  USER = 'USER'
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  // AUTHOR ROLES
  .grant(Role.EMPLEADO)
  .createOwn([Recurso.VENTA])
  .readOwn([Recurso.VENTA])
  // ADMIN ROLES
  .grant(Role.ADMIN)
  .extend(Role.EMPLEADO)
  .createAny([Recurso.EMPLEADO, Recurso.USER])
  .updateAny([Recurso.EMPLEADO, Recurso.USER])
  .deleteAny([Recurso.EMPLEADO, Recurso.VENTA, Recurso.USER]);



/*   
export enum AppRoles {
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
}

export enum AppResource {
  USER = 'USER',
  POST = 'POST',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  // AUTHOR ROLES
  .grant(AppRoles.AUTHOR)
  .updateOwn([AppResource.USER])
  .deleteOwn([AppResource.USER])
  .createOwn([AppResource.POST])
  .updateOwn([AppResource.POST])
  .deleteOwn([AppResource.POST])
  // ADMIN ROLES
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.AUTHOR)
  .createAny([AppResource.USER])
  .updateAny([AppResource.POST, AppResource.USER])
  .deleteAny([AppResource.POST, AppResource.USER]); */