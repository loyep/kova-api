import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common"
import { classToPlain } from "class-transformer"

export interface Response {
  data: any
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const call$ = next.handle()
    return call$.pipe(
      map((result: any) => {
        result = classToPlain(result) || {}
        const { data, message } = result
        return { code: 0, message: message || "成功", data: data ? data : result }
      }),
    )
  }
}
