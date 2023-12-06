import { RolesBuilder } from 'nest-access-control';

export enum Role {
  ADMIN = 'ADMIN',
  EMPLEADO = 'EMPLEADO',
  BODEGUERO = 'BODEGUERO',
  CAJERO = 'CAJERO',
  SUPERADMIN = 'SUPERADMIN',
  RRHH = 'RRHH',
  COMPRAS = 'COMPRAS',
  VENTAS = 'VENTAS'
}

export enum Recurso {
  EMPLEADO = 'EMPLEADO',
  VENTA = 'VENTA',
  USER = 'USER',
  CAJERO = 'CAJERO',
  SUCURSAL= 'SUCURSAL'
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
  .deleteAny([Recurso.EMPLEADO, Recurso.VENTA, Recurso.USER])
  .grant(Role.CAJERO)
  .createOwn([Recurso.CAJERO])
  // SUPER ADMIN ROLE
  .grant(Role.SUPERADMIN)
  .createAny([Recurso.SUCURSAL])
  .updateAny([Recurso.SUCURSAL])
  .deleteAny([Recurso.SUCURSAL])



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