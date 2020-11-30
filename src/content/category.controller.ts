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
import { APIPrefix } from '@/constants/constants';
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

  @Get(`${APIPrefix}/category/:slug`)
  async getBySlug(@Param('slug') slug: string, @Res() res) {
    const category = await this.categoryService.findBySlug(slug);

    return res.json({
      errorCode: ErrorCode.SUCCESS.CODE,
      data: category,
    });
  }
}
