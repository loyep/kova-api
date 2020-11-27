import * as url from 'url';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '@/common/logger.service';
import { UserService } from '@/user/user.service';
import { User } from '@/entity/user.entity';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
  ) {}

  async use(request: Request, response: Response, next: () => void) {
    const req: any = request;
    const res: any = response;

    req.user = null;
    const userID = req.session.userId;
    if (userID) {
      const user: User = await this.userService.getUser(userID);
      req.user = user;
    }
    next();
  }
}
