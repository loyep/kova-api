import { APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { CurUser } from '@/core/decorators/user.decorator';
import { MyHttpException } from '@/core/exception/my-http.exception';
import { User } from '@/entity/user.entity';
import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Get,
  Query,
  Param,
  Res,
  Delete,
  Req,
} from '@nestjs/common';
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
    req.session.userId = user.id;
    res.json({
      errorCode: ErrorCode.SUCCESS.CODE,
      data: { id: user.id },
    });
  }

  @Get(`${APIPrefix}/profile`)
  async profile(@CurUser() user, @Res() res) {
    console.log('profile', user);
    if (user) {
      return res.json({
        errorCode: ErrorCode.SUCCESS.CODE,
        user: user,
      });
    }
    return res.status(403).json({
      errorCode: ErrorCode.Forbidden.CODE,
      message: 'You are not authorized',
    });
  }
}
