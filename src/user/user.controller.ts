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
import { Response } from 'express';
import { ConfigService } from '../config/config.service';

@Controller()
export class UserController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/login')
  @Post('/login')
  login(@Req() req: any, @Res() res: Response) {
    if (req.user) {
      return res.json({
        user: req.user,
      });
    }
    req.session.username = new Date();
    return '无数据';
  }
}
