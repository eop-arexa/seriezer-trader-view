import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class UserUnauthorizedException extends BaseException {
  constructor(msg: string) {
    super(msg, HttpStatus.UNAUTHORIZED);
  }
}

export class VerifyTokenNotValidException extends BaseException {
  constructor(msg?: string) {
    super(msg ? msg : `Verify token not valid`, HttpStatus.BAD_REQUEST);
  }
}

export class UserUnauthenticatedException extends BaseException {
  constructor(msg: string) {
    super(msg, HttpStatus.UNAUTHORIZED);
  }
}
