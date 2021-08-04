import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Logger } from 'src/utils/log4js.util'
import { Response } from 'src/types'

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req = context.getArgByIndex(1).req
    return next.handle().pipe(
      map((data) => {
        const payload = {
          code: data?.code || context.switchToHttp().getResponse().statusCode,
          data: data?.data,
          message: data?.message || 'Success.',
        }
        const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    User: ${JSON.stringify(req.user)}
    Response data:\n ${JSON.stringify(payload)}
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`
        Logger.info(logFormat)
        Logger.access(logFormat)
        return payload
      }),
    )
  }
}
