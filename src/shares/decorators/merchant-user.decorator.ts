import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MerchantUserProperties } from '../constants/constant';

export const MerchantUserDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  switch (data) {
    case MerchantUserProperties.USER_ID:
      return user[MerchantUserProperties.USER_ID];
    case MerchantUserProperties.IDENTIFIER:
      return user[MerchantUserProperties.IDENTIFIER];
    default:
      return user;
  }
});
