import * as url from 'url';
import * as csurf from 'csurf';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { APIPrefix } from '@/constants/constants';
import { LoggerService } from '@/common/logger.service';

const csrfProtection = csurf({
  cookie: true,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: () => void) {
    const req: any = request;
    const res: any = response;

    req.session.username = new Date();
    next();
  }
}
