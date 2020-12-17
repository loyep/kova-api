import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    return !!req.user;
  }
}
