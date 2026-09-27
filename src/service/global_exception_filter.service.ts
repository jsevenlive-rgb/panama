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
  UnauthorizedException,
} from '@nestjs/common';

import { ErrorResponse, ErrorResponseLang, ErrorUnitpayResponse } from '../response/error.dto';
import { ERROR_TYPES } from '../constant/error.constant';
import { throwError } from 'rxjs';
import { I18nValidationException } from 'nestjs-i18n';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { Request, Response } from 'express';
import { HttpArgumentsHost, RpcArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import * as requestIp from 'request-ip';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    let ctx: HttpArgumentsHost | RpcArgumentsHost | WsArgumentsHost;

    //There will be request and response objects for http
    let http_request: Request;
    let http_response: Response;

    //Status for HTTP responses only
    let response_status: HttpStatus;

    //Object containing the request for logging
    let request_log: any;

    //look at the request type
    switch (host.getType()) {
      case 'http':
        ctx = host.switchToHttp();
        http_request = ctx.getRequest<Request>();
        http_response = ctx.getResponse<Response>();
        request_log = {
          protocol: 'http',
          originalUrl: http_request.originalUrl || '',
          body: http_request.body || '',
          params: http_request.params || '',
          method: http_request.method || '',
          httpVersion: http_request.httpVersion || '',
          headers: http_request.headers || '',
          ip: requestIp.getClientIp(http_request),
          user: http_request.user || null,
        };
        break;
      case 'ws':
        ctx = host.switchToWs();
        request_log = {
          protocol: 'ws',
          client: ctx.getClient(),
          data: ctx.getData(),
        };
        break;
      case 'rpc':
        ctx = host.switchToRpc();
        request_log = {
          protocol: 'rpc',
          data: ctx.getData(),
        };
        break;
      default:
        throw new BadRequestException();
    }

    //The error response will always be of type ErrorResponse for json
    let api_error: ErrorResponse | ErrorResponseLang | ErrorUnitpayResponse;

    //Most errors are important status log (info)
    let log_level: LogLevel = 'warn';

    let exception_log = exception;

    switch (exception.constructor) {
      case BadRequestException:
        response_status = (exception as BadRequestException).getStatus();
        api_error = new ErrorResponse(ERROR_TYPES.WRONG_PARAMS_ERROR, (exception as BadRequestException).message);
        break;
      case HttpException:
        let error_type: ERROR_TYPES;
        response_status = (exception as HttpException).getStatus();
        switch ((exception as HttpException).getStatus()) {
          case HttpStatus.INTERNAL_SERVER_ERROR:
            error_type = ERROR_TYPES.INTERNAL_SERVER_ERROR;
            break;
          default:
            error_type = ERROR_TYPES.HTTP_ERROR;
        }
        api_error = new ErrorResponse(error_type, HttpStatus[(exception as HttpException).getStatus()] as string);
        break;
      case I18nValidationException:
        response_status = (exception as I18nValidationException).getStatus();
        api_error = new ErrorResponse(
          ERROR_TYPES.I18nValidationException,
          (exception as I18nValidationException).message
        );
        api_error.setValidatorError((exception as I18nValidationException).errors);
        break;
      case UnauthorizedException:
        response_status = HttpStatus.UNAUTHORIZED;
        api_error = new ErrorResponseLang('auth.unauthorized');
        break;
      case ErrorResponse:
        response_status = HttpStatus.BAD_REQUEST;
        api_error = exception as ErrorResponse;
        break;
      case NotFoundException:
        response_status = HttpStatus.NOT_FOUND;
        api_error = new ErrorResponse(ERROR_TYPES.NOT_FOUND, 'Method not found');
        break;
      case ErrorResponseLang:
        response_status = HttpStatus.BAD_REQUEST;
        api_error = exception as ErrorResponseLang;
        break;
      case ErrorUnitpayResponse:
        response_status = HttpStatus.INTERNAL_SERVER_ERROR;
        api_error = exception as ErrorUnitpayResponse;
        break;
      default:
        response_status = HttpStatus.INTERNAL_SERVER_ERROR;
        api_error = new ErrorResponseLang('other.unknown');
        log_level = 'error';
        exception_log = (exception_log as Error).stack || exception_log.toString() || '';
        break;
    }

    const log_message = { request: request_log, error: exception_log, response: api_error };

    switch (log_level) {
      case 'error':
        this.logger.error(log_message, exception.constructor.name);
        break;
      case 'warn':
        this.logger.warn(log_message, exception.constructor.name);
        break;
      default:
        this.logger.debug(log_message, exception.constructor.name);
        break;
    }

    switch (host.getType()) {
      case 'http':
        http_response.status(response_status).json(api_error);
        break;
      case 'ws':
      case 'rpc':
      default:
        return throwError(() => api_error);
    }
  }
}
