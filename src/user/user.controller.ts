import { APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { CurUser } from '@/core/decorators/user.decorator';
import { MyHttpException } from '@/core/exception/my-http.exception';
import { Controller, Post, Body, Get, Res, Req, Param } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get(`${APIPrefix}/users`)
  async getAll(@Res() res) {
    const user = await this.userService.all();
    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      data: user,
    });
  }

  @Get(`${APIPrefix}/users/:name`)
  async getByName(@Param('name') name: string, @Res() res) {
    try {
      const user = await this.userService.findByName(name);
      return res.json({
        code: ErrorCode.SUCCESS.CODE,
        data: user,
      });
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      });
    }
  }
}
