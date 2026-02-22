import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceResponseDto } from '../dto/service-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: any[] | undefined;

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const res = response as any;
        // ValidationPipe puts per-field errors in res.message as an array
        if (Array.isArray(res.message)) {
          message = 'Validation failed';
          errors = res.message;
        } else {
          message = res.message ?? exception.message;
        }
      } else {
        message = exception.message;
      }
    }

    const errorResponse: ServiceResponseDto<null> = {
      state: false,
      data: null,
      message,
      statusCode: status,
      error: exception instanceof Error ? exception.message : 'Unknown error',
      ...(errors ? { errors } : {}),
    };

    response.status(status).json(errorResponse);
  }
}
