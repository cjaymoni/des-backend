import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && request.body) {
      const method = request.method;
      
      if (method === 'POST' && !request.body.createdBy) {
        request.body.createdBy = user.userId || user.sub;
      }
      
      if ((method === 'PUT' || method === 'PATCH') && !request.body.updatedBy) {
        request.body.updatedBy = user.userId || user.sub;
      }
    }

    return next.handle();
  }
}
