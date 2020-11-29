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

@Controller()
export class CategoryController {
  constructor(
    private readonly configService: ConfigService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('/p/:slug')
  async getPost(@Param('slug') slug: string, @Res() res) {
    return;
  }

  @Get(`${APIPrefix}/categories`)
  async all(query: any = {}, page: number, pageSize: number) {
    return await this.categoryService.all();
  }
}