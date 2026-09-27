import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { ErrorResponse } from '../response/error.dto';
import { ERROR_TYPES } from '../constant/error.constant';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';
import * as requestIp from 'request-ip';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
      return;
    }

    const ctx = host.switchToHttp();
    const http_request = ctx.getRequest<Request>();
    const http_response = ctx.getResponse<Response>();

    const request_log = {
      originalUrl: http_request.originalUrl || '',
      body: http_request.body || '',
      params: http_request.params || '',
      method: http_request.method || '',
      headers: http_request.headers || '',
      ip: requestIp.getClientIp(http_request),
    };

    let response_status: HttpStatus;
    let api_error: ErrorResponse;
    let log_level: 'warn' | 'error' = 'warn';
    let exception_log: unknown = exception;

    if (exception instanceof NotFoundException) {
      response_status = HttpStatus.NOT_FOUND;
      api_error = new ErrorResponse(ERROR_TYPES.NOT_FOUND, 'Method not found');
    } else if (exception instanceof BadRequestException) {
      response_status = exception.getStatus();
      api_error = new ErrorResponse(ERROR_TYPES.WRONG_PARAMS_ERROR, exception.message);
    } else if (exception instanceof ErrorResponse) {
      response_status = HttpStatus.BAD_REQUEST;
      api_error = exception;
    } else if (exception instanceof HttpException) {
      response_status = exception.getStatus();
      const error_type =
        response_status === HttpStatus.INTERNAL_SERVER_ERROR ? ERROR_TYPES.INTERNAL_SERVER_ERROR : ERROR_TYPES.HTTP_ERROR;
      api_error = new ErrorResponse(error_type, HttpStatus[response_status] as string);
    } else {
      response_status = HttpStatus.INTERNAL_SERVER_ERROR;
      api_error = new ErrorResponse(ERROR_TYPES.UNKNOWN_ERROR, 'Unknown error');
      log_level = 'error';
      exception_log = exception instanceof Error ? exception.stack : String(exception);
    }

    const log_message = { request: request_log, error: exception_log, response: api_error };
    const exception_name = exception instanceof Error ? exception.constructor.name : 'UnknownException';

    if (log_level === 'error') {
      this.logger.error(log_message, exception_name);
    } else {
      this.logger.warn(log_message, exception_name);
    }

    http_response.status(response_status).json(api_error);
  }
}
