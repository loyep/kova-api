import * as util from 'util';
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

@Controller()
export class UserController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/login')
  login(@Req() req) {
    const username = req.session.username;
    if (username) {
      req.session.userId = 1;
      return username;
    }
    req.session.username = new Date();
    return '无数据';
  }
}
