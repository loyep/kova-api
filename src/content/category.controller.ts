import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryNotFound, CategoryService } from './category.service';
import { AdminAPIPrefix, APIPrefix } from '@/constants/constants';
import { ApiOperation } from '@nestjs/swagger';
import { LoggerService } from '@/common/logger.service';
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly logger: LoggerService) {}

  @ApiOperation({ summary: '分类列表', tags: ['category'] })
  @Get(`${APIPrefix}/categories`)
  async list(@Query('s') s: string, @Query('page', ParsePagePipe) page: number) {
    const data = await this.categoryService.list({ page });
    return data;
  }

  @ApiOperation({ summary: '根据slug查询分类', tags: ['category'] })
  @Get(`${APIPrefix}/categories/:slug`)
  async showBySlug(@Param('slug') slug: string) {
    try {
      const category = await this.categoryService.findBySlug(slug);
      if (!category) {
        throw CategoryNotFound;
      }
      return category;
    } catch (error) {
      throw CategoryNotFound;
    }
  }

  @ApiOperation({ summary: '查询分类', tags: ['category'] })
  @Get(`${AdminAPIPrefix}/categories/:id`)
  async show(@Param('id') id: number) {
    const category = await this.categoryService.findById(id);
    return category;
  }
}
