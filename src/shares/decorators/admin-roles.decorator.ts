import { SetMetadata } from '@nestjs/common';
import { ADMIN_ROLE_KEY } from 'src/shares/constants/constant';
import { AdminRole } from 'src/shares/enums/admins-role.enum';

export const AdminRoles = (...roles: AdminRole[]) => SetMetadata(ADMIN_ROLE_KEY, roles);
