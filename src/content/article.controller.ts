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
} from '@nestjs/common';
import { ConfigService } from '@/config/config.service';

@Controller()
export class ArticleController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/p/:slug')
  async getArticle(@Param('slug') slug: string, @Res() res) {
    return;
  }
}
