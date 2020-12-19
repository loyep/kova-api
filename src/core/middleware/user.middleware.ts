import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '@/user/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  use(request: Request, response: Response, next: () => void) {
    const req: any = request;
    const res: any = response;

    req.user = null;
    const userId = req.session.userId;
    console.log(userId);
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
