import { SetMetadata } from '@nestjs/common';
import Permission from 'src/auth/enums/permission.type';


export const PERMISSIONS_KEY = 'permissions';
export const PermissionsRequired = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);