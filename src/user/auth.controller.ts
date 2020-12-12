import { APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { CurUser } from '@/core/decorators/user.decorator';
import { MyHttpException } from '@/core/exception/my-http.exception';
// import { User } from '@/model/user.entity';
import { Controller, Post, Body, Get, Res, Req, Param } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';

@Controller()
export class AuthController {
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
        code: ErrorCode.ParamsError.CODE,
        message: '账号或密码不正确',
      });
    }
    const curUser = await this.userService.getUser(user.id);
    req.session.userId = user.id;
    console.log(req.session.cookie);
    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      user: curUser,
    });
  }

  @Post(`${APIPrefix}/register`)
  async register(@Body() registerDto: RegisterDto, @Req() req, @Res() res) {
    const user = await this.userService.findUser(
      {
        name: registerDto.username,
      },
      { id: true, password: true },
    );
    if (
      !user ||
      !this.userService.verifyPassword(registerDto.password, user.password)
    ) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
        message: '账号或密码不正确',
      });
    }
    const curUser = await this.userService.getUser(user.id);
    req.session.userId = user.id;
    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      user: curUser,
    });
  }

  @Post(`${APIPrefix}/logout`)
  async logout(@Req() req, @Res() res) {
    req.session.userId = null;
    req.session.destroy(function (err) {
      /*销毁session*/
    });
    res.json({
      code: ErrorCode.SUCCESS.CODE,
      message: '退出成功',
    });
  }

  @Post(`${APIPrefix}/password/email`)
  async sendResetLinkEmail(@Res() res) {
    res.json({
      code: ErrorCode.SUCCESS.CODE,
      message: '我们已通过电子邮件发送您的密码重置链接！',
    });
  }

  @Post(`${APIPrefix}/password/reset`)
  async reset(@Res() res) {
    res.json({
      code: ErrorCode.SUCCESS.CODE,
      message: '我们已通过电子邮件发送您的密码重置链接！',
    });
  }

  @Get(`${APIPrefix}/profile`)
  async profile(@CurUser() user, @Res() res) {
    if (user) {
      return res.json({
        code: ErrorCode.SUCCESS.CODE,
        user: user,
      });
    }
    throw new MyHttpException({
      code: ErrorCode.Forbidden.CODE,
      message: ErrorCode.Forbidden.MESSAGE,
    });
  }

  @Get(`${APIPrefix}/curUser`)
  async user(@CurUser() user, @Res() res) {
    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      user: user || null,
    });
  }
}
