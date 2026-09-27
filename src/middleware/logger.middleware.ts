import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as requestIp from 'request-ip';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const request = {
      originalUrl: req.originalUrl || '',
      body: req.body || '',
      params: req.params || '',
      method: req.method || '',
      httpVersion: req.httpVersion || '',
      headers: req.headers || '',
      statusCode: res.statusCode || '',
      statusMessage: res.statusMessage || '',
      ip: requestIp.getClientIp(req),
    };
    this.logger.log({ request: request }, 'Request');
    next();
  }
}
