import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminUserProperties } from '../constants/constant';

export const AdminUserDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  switch (data) {
    case AdminUserProperties.USER_ID:
      return user[AdminUserProperties.USER_ID];
    case AdminUserProperties.IDENTIFIER:
      return user[AdminUserProperties.IDENTIFIER];
    default:
      return user;
  }
});
