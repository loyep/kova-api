import { Controller, Get, Param, Res } from '@nestjs/common';
import { CategoryNotFound, CategoryService } from './category.service';
import { AdminAPIPrefix, APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { LoggerService } from '@/common/logger.service';

@Controller()
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: LoggerService,
  ) {}

  @Get(`${APIPrefix}/categories`)
  async all() {
    return await this.categoryService.all();
  }

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

  @Get(`${AdminAPIPrefix}/categories/:id`)
  async show(@Param('id') id: number) {
    const category = await this.categoryService.findById(id);
    return category;
  }
}
