import { APIPrefix, AdminAPIPrefix } from '../constants/constants';
import { Controller, Get, Query, Param, Res, Delete } from '@nestjs/common';
import { Tag } from '@/entity/tag.entity';
import { TagService, TagNotFound } from './tag.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '标签列表', tags: ['tag'] })
  @Get(`${APIPrefix}/tags`)
  async getAll() {
    const tags: Tag[] = await this.tagService.all();
    return tags;
  }

  @ApiOperation({ summary: '根据slug查标签', tags: ['tag'] })
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
