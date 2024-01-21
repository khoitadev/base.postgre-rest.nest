import { SetMetadata } from '@nestjs/common';
import { RoleAuth } from '~/enum';

export const ROLES_KEY = 'roles';
export const Role = (...roles: RoleAuth[]) => SetMetadata(ROLES_KEY, roles);
