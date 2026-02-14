import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceResponseDto } from '../dto/service-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ServiceResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ServiceResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;

        return {
          state: true,
          data,
          message: 'Operation successful',
          statusCode,
        };
      }),
    );
  }
}
