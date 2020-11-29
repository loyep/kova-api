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
import { User } from '@/entity/user.entity';
import { Article } from '@/entity/article.entity';
import { Category } from '@/entity/category.entity';
import { TagService } from './tag.service';

@Controller()
export class TagController {
  constructor(
    private readonly configService: ConfigService,
    private readonly tagService: TagService,
  ) {}

  @Get(`${APIPrefix}/tags`)
  async all() {
    const categories: Category[] = await this.tagService.all();
    return categories;
  }
}
