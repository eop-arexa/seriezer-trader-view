import { CallHandler, ExecutionContext, Inject, Injectable, LoggerService, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { isStringTooLong } from '../helpers/utils';
import { hrtime } from 'process';
import * as pako from 'pako';
import fastJson from 'fast-json-stringify';
import { Reflector } from '@nestjs/core';
import { COMPRESS_RESPONSE } from '../constants/constant';

@Injectable()
export class MicroserviceInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
    if (ctx.getType() !== 'rpc') {
      return;
    }
    const clazz = ctx.getClass();
    const handler = ctx.getHandler();
    const request = ctx.switchToRpc().getData();
    const prefix = `${clazz.name}:${handler.name}`;
    const elapsedStart = hrtime();
    this.logger.log({ request, elapsedStart }, `${prefix} - Request`);
    const logger = this.logger;
    const isCompressResponse = this.reflector.getAllAndOverride<boolean[]>(COMPRESS_RESPONSE, [handler, clazz]);
    const stringify = fastJson({});

    return next.handle().pipe(
      map((response) => {
        if (!isCompressResponse) {
          return response;
        }

        const jsonString = stringify(response);
        const utf8Data = new TextEncoder().encode(jsonString);
        const compressedData = pako.gzip(utf8Data);

        return Buffer.from(compressedData).toString('base64');
      }),
      tap({
        next(response) {
          const elapsedEnd = hrtime(elapsedStart);
          const processTime = elapsedEnd[0] * 1000 + elapsedEnd[1] / 1000000 + 'ms';
          logger.log(
            {
              request,
              response: isStringTooLong(response) ? 'SHORTENED_RESPONSE' : response,
              processTime,
            },
            `${prefix} - Response`,
          );
        },
        error(err) {
          logger.error({ request, error: err }, `${prefix} - Error`);
        },
      }),
    );
  }
}
