import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { classToPlain } from 'class-transformer';

export interface Response {
  data: any;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const call$ = next.handle();
    return call$.pipe(
      map((data: any) => {
        data = classToPlain(data);
        return { code: 0, data };
      }),
    );
  }
}
