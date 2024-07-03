import { CallHandler, ExecutionContext, Inject, Injectable, LoggerService, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class MicroserviceLoggingInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
    if (ctx.getType() !== 'rpc') {
      return;
    }
    const clazz = ctx.getClass();
    const handler = ctx.getHandler();
    const request = ctx.switchToRpc().getData();
    const prefix = `${clazz.name}:${handler.name}`;
    const elapsedStart = Date.now();
    this.logger.log({ request, elapsedStart }, `${prefix} - Request`);
    const logger = this.logger;
    return next.handle().pipe(
      tap({
        next(response) {
          const elapsedEnd = Date.now();
          const processTime = elapsedStart > 0 ? elapsedEnd - elapsedStart + 'ms' : '0ms';
          logger.log({ request, response, elapsedStart, elapsedEnd, processTime }, `${prefix} - Response`);
          return response;
        },
        error(err) {
          logger.error({ request, error: err }, `${prefix} - Error`);
        },
      }),
    );
  }
}
