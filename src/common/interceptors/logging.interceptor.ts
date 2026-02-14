import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const delay = Date.now() - now;
          // const timing = delay < 100 ? '🟢' : delay < 500 ? '🟡' : '🔴';
          response.setHeader('X-Response-Time', `${delay}ms`);
          this.logger.log(
            `${method} ${url} ${statusCode} ${delay}ms - ${userAgent} ${ip}`,
          );
        },
        error: (error) => {
          const delay = Date.now() - now;
          const response = context.switchToHttp().getResponse();
          response.setHeader('X-Response-Time', `${delay}ms`);
          this.logger.error(
            ` ${method} ${url} ${error.status || 500} ${delay}ms - ${userAgent} ${ip}`,
            error.stack,
          );
        },
      }),
    );
  }
}
