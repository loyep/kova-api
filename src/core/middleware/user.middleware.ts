import * as url from 'url';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '@/common/logger.service';
import { UserService } from '@/user/user.service';
import { User } from '@/model/user.entity';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  use(request: Request, response: Response, next: () => void) {
    const req: any = request;
    const res: any = response;

    req.user = null;
    const userId = req.session.userId;
    if (!userId) {
      next();
      return;
    }

    this.userService.getUser(userId).then((user) => {
      req.user = user;
      next();
    });
  }
}
