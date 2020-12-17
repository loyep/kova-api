import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  Logger,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { MyHttpException } from '../exceptions/my-http.exception';
import {} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('LoggerService', true);

  catch(exception: HttpException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse();
    if (exception instanceof MyHttpException) {
      return res.status(HttpStatus.OK).json({
        code: exception.code,
        message: exception.message,
      });
    }
    // 对默认的 404 进行特殊处理
    return res.status(HttpStatus.OK).json({
      code: exception.getStatus(),
      message: exception.message,
    });
  }
}
