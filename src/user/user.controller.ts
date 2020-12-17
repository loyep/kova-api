import { APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { MyHttpException } from '@/core/exceptions/my-http.exception';
import { Controller, Get, Res, Param } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get(`${APIPrefix}/users`)
  async getAll() {
    const users = await this.userService.all();
    return users;
  }

  @Get(`${APIPrefix}/users/:name`)
  async getByName(@Param('name') name: string) {
    try {
      const user = await this.userService.findByName(name);
      return user;
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      });
    }
  }
}
