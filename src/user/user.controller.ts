import { APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { CurUser } from '@/core/decorators/user.decorator';
import { MyHttpException } from '@/core/exception/my-http.exception';
import { User } from '@/entity/user.entity';
import { Controller, Post, Body, Get, Res, Req } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Post(`${APIPrefix}/login`)
  async login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
    const user = await this.userService.findUser(
      {
        name: loginDto.username,
      },
      { id: true, password: true },
    );
    if (
      !user ||
      !this.userService.verifyPassword(loginDto.password, user.password)
    ) {
      throw new MyHttpException({
        errorCode: ErrorCode.ParamsError.CODE,
        message: '账号或密码不正确',
      });
    }
    const curUser = await this.userService.getUser(user.id);
    req.session.userId = user.id;
    console.log(req.session.cookie);
    return res.json({
      errorCode: ErrorCode.SUCCESS.CODE,
      user: curUser,
    });
  }

  @Post(`${APIPrefix}/logout`)
  async logout(@Req() req, @Res() res) {
    req.session.userId = null;
    res.json({
      errorCode: ErrorCode.SUCCESS.CODE,
      message: '退出成功',
    });
  }

  @Get(`${APIPrefix}/profile`)
  async profile(@CurUser() user, @Res() res) {
    // if (user) {
    //   return res.json({
    //     errorCode: ErrorCode.SUCCESS.CODE,
    //     user: user,
    //   });
    // }
    return res.status(403).json({
      errorCode: ErrorCode.Forbidden.CODE,
      message: 'You are not authorized',
    });
  }

  @Get(`${APIPrefix}/curUser`)
  async user(@CurUser() user, @Res() res) {
    return res.json({
      errorCode: ErrorCode.SUCCESS.CODE,
      user: user || null,
    });
  }
}
