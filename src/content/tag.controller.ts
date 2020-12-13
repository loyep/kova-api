import { APIPrefix, AdminAPIPrefix } from '../constants/constants';
import { Controller, Get, Query, Param, Res, Delete } from '@nestjs/common';
import { Category } from '@/entity/category.entity';
import { TagService } from './tag.service';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

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
