import { UsersRole } from '../enums/users-role.enum';
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/constant';

export const Roles = (...roles: UsersRole[]) => SetMetadata(ROLES_KEY, roles);
