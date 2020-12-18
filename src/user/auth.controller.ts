import { LoggerService } from '@/common/logger.service';
import { APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { CurUser } from '@/core/decorators/user.decorator';
import { MyHttpException } from '@/core/exceptions/my-http.exception';
import { GuestGuard } from '@/core/guards/guest.guard';
import { Controller, Post, Body, Get, Res, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService, private readonly logger: LoggerService) {}

  @Post(`${APIPrefix}/login`)
  async login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
    const user = await this.userService.findUser(
      {
        name: loginDto.username,
      },
      { id: true, password: true },
    );
    if (!user || !this.userService.verifyPassword(loginDto.password, user.password)) {
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
  async register(@Body() registerDto: RegisterDto, @Req() req) {
    const user = await this.userService.findUser(
      {
        name: registerDto.username,
      },
      { id: true, password: true },
    );
    if (!user || !this.userService.verifyPassword(registerDto.password, user.password)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
        message: '账号或密码不正确',
      });
    }
    const curUser = await this.userService.getUser(user.id);
    req.session.userId = user.id;
    return {
      user: curUser,
    };
  }

  @Post(`${APIPrefix}/logout`)
  @UseGuards(GuestGuard)
  async logout(@Req() req, @Res() res) {
    req.session.userId = null;
    req.session.destroy(() => {
      this.logger.info({ message: 'user logout' });
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
  async profile(@CurUser() user) {
    if (!user) {
      throw new MyHttpException({
        code: ErrorCode.Forbidden.CODE,
        message: ErrorCode.Forbidden.MESSAGE,
      });
    }
    return user;
  }

  @Get(`${APIPrefix}/curUser`)
  async user(@CurUser() user) {
    return user || null;
  }
}
