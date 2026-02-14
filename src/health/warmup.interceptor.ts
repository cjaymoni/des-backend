import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Connection } from 'typeorm';

@Injectable()
export class WarmupInterceptor implements NestInterceptor {
  private isWarmedUp = false;

  constructor(@InjectConnection() private connection: Connection) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (!this.isWarmedUp) {
      await this.connection.query('SELECT 1');
      this.isWarmedUp = true;
    }
    return next.handle();
  }
}
