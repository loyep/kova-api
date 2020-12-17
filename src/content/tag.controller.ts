import { APIPrefix, AdminAPIPrefix } from '../constants/constants';
import { Controller, Get, Query, Param, Res, Delete } from '@nestjs/common';
import { Tag } from '@/entity/tag.entity';
import { TagService, TagNotFound } from './tag.service';
import { ErrorCode } from '@/constants/error';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get(`${APIPrefix}/tags`)
  async getAll() {
    const tags: Tag[] = await this.tagService.all();
    return tags;
  }

  @Get(`${APIPrefix}/tags/:slug`)
  async showBySlug(@Param('slug') slug: string) {
    try {
      const tag = await this.tagService.findBySlug(slug);
      if (!tag) {
        throw TagNotFound;
      }
      return tag;
    } catch (error) {
      throw TagNotFound;
    }
  }
}
