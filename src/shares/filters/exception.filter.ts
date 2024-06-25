import { ArgumentsHost, Catch, ExceptionFilter, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { createGeneralExceptionError } from '../exceptions/errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const responseError = createGeneralExceptionError(exception);

    this.logger.error(responseError.message, {
      ...responseError,
      ...(exception.message.logData && { ...exception.message.logData }),
      ...(exception.message.data && { ...exception.message.data }),
      stack: exception.stack,
    });

    response.status(responseError.statusCode).json(responseError);
  }
}
