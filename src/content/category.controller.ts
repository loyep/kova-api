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
import { CategoryService } from './category.service';
import { AdminAPIPrefix, APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';

@Controller()
export class CategoryController {
  constructor(
    private readonly configService: ConfigService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get(`${APIPrefix}/categories`)
  async all(query: any = {}, page: number, pageSize: number) {
    return await this.categoryService.all();
  }

  @Get(`${APIPrefix}/categories/:slug`)
  async showBySlug(@Param('slug') slug: string, @Res() res) {
    const category = await this.categoryService.findBySlug(slug);

    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      data: category,
    });
  }

  @Get(`${AdminAPIPrefix}/categories/:id`)
  async show(@Param('id') id: number, @Res() res) {
    const category = await this.categoryService.findById(id);

    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      data: category,
    });
  }
}
