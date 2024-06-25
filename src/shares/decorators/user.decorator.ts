import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserProperties } from '../constants/constant';
import jwt from 'jsonwebtoken';
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (user) {
    switch (data) {
      case UserProperties.USER_ID:
        return user[UserProperties.USER_ID];
      default:
        return user;
    }
  }
  // In case of a route is not applied Guard
  const jwtToken = request.header('authorization')?.split(' ')?.[1];
  if (!jwtToken) {
    return null;
  }
  try {
    const decodedData = jwt.decode(jwtToken);
    switch (data) {
      case UserProperties.USER_ID:
        return decodedData[UserProperties.USER_ID];
      case UserProperties.USER_NAME:
        return decodedData[UserProperties.USER_NAME];
      default:
        return user;
    }
  } catch (e) {
    throw new UnauthorizedException(e);
  }
});
