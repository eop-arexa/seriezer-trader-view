import { HttpException, HttpStatus } from '@nestjs/common';
import { IGeneralErrorShape } from './errors.interface';

export function createGeneralExceptionError(error): IGeneralErrorShape {
  if (!error) {
    return {
      message: 'Internal server error occurred',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
  if (error instanceof HttpException) {
    const res = error.getResponse();
    if (typeof res === 'string') {
      return {
        statusCode: error.getStatus(),
        message: res,
      };
    }
    return error.getResponse() as IGeneralErrorShape;
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      description: error.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  return {
    message: error.message,
  };
}
