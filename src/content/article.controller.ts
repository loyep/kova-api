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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entity/user.entity';
import { Article, ArticleStatus } from '@/entity/article.entity';
import { ArticleService } from './article.service';

@Controller()
export class ArticleController {
  constructor(
    private readonly configService: ConfigService,
    private readonly articleService: ArticleService,
  ) {}

  @Get('/p/:slug')
  async getPost(@Param('slug') slug: string, @Res() res) {
    return;
  }

  async all() {
    const articles: Article[] = await this.articleService.all();
    return articles;
  }
}
