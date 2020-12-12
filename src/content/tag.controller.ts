import { APIPrefix, AdminAPIPrefix } from '../constants/constants';
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
import { User } from '@/model/user.entity';
import { Article } from '@/model/article.entity';
import { Category } from '@/model/category.entity';
import { TagService } from './tag.service';

@Controller()
export class TagController {
  constructor(
    private readonly configService: ConfigService,
    private readonly tagService: TagService,
  ) {}

  @Get(`${APIPrefix}/tags`)
  async getAll() {
    const categories: Category[] = await this.tagService.all();
    return categories;
  }

  @Get(`${APIPrefix}/tags/:slug`)
  async getBySlug() {
    const categories: Category[] = await this.tagService.all();
    return categories;
  }
}
