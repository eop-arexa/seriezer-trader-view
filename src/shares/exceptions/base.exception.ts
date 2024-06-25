import { HttpException } from '@nestjs/common';
import { IError } from './errors_with_code';

export class BaseException extends HttpException {
  constructor(message: string, httpStatus: number, private readonly data?: IError) {
    super(message, httpStatus);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getResponse() {
    const message = super.getResponse();
    if (this.data) {
      return {
        ...this.data,
        statusCode: this.getStatus(),
        message: this.data.message,
        error: message,
      };
    }
    return {
      statusCode: this.getStatus(),
      message: message,
      error: message,
    };
  }
}
