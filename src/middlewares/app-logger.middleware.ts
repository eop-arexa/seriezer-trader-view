import { Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import httpContext from 'express-http-context';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService;

  private _writeLog(req: Request, res: Response): void {
    const correlationId = getCorrelationId();

    this.logger.log(`HTTP Request: ${correlationId}`, [
      {
        correlationId,
        user: (req as any)?.user,
        request: {
          ip: req.ip,
          realIp: req.headers['x-real-ip'],
          ips: req.ips,
          method: req.method,
          url: req.url,
          originalUrl: req.originalUrl,
          body: req.body.password === undefined ? req.body : { ...req.body, password: '*' },
          query: req.query,
          headers: req.headers,
        },
      },
    ]);

    const originalWrite = res.write;
    const originalEnd = res.end;
    let responseBody = '';
    const chunks = [];
    res.write = (...args) => {
      const chunk = args[0];
      chunks.push(chunk);
      return originalWrite.apply(res, args);
    };

    res.end = (...args) => {
      const chunk = args[0];
      if (chunk) chunks.push(chunk);
      responseBody = Buffer.concat(chunks).toString('utf-8');
      return originalEnd.apply(res, args);
    };

    res.on('finish', () => {
      let responseBodyJson = null;
      try {
        responseBodyJson = JSON.parse(responseBody);
      } catch (e) {
        responseBodyJson = responseBody;
      }

      this.logger.log(`HTTP Response: ${correlationId}`, [
        {
          correlationId,
          user: (req as any)?.user,
          request: {
            ip: req.ip,
            realIp: req.headers['x-real-ip'],
            ips: req.ips,
            method: req.method,
            url: req.url,
            originalUrl: req.originalUrl,
            body: req.body.password === 'undefined' ? req.body : { ...req.body, password: '*' },
            query: req.query,
            headers: req.headers,
          },
          response: {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.getHeaders(),
            body: responseBodyJson,
          },
        },
      ]);
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this._writeLog(req, res);
    next();
  }
}

/**
 * To retrieve the correlationId, firstly lookup at the http context
 * *f the context is not set, try to generate a brand new one
 */
export function getCorrelationId(): string {
  let correlationId = httpContext.get('correlationId');
  if (!correlationId) {
    correlationId = crypto.randomUUID();
    httpContext.set('correlationId', correlationId);
  }
  return correlationId;
}
