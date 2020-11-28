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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entity/user.entity';
import { Post as PostEntity, PostStatus } from '@/entity/post.entity';

@Controller()
export class CategoryController {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Post)
    private readonly articleRepository: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get('/p/:slug')
  async getPost(@Param('slug') slug: string, @Res() res) {
    return;
  }

  async getAll(query: any = {}, page: number, pageSize: number) {
    const builder = this.articleRepository
      .createQueryBuilder('p')
      .where('status = :status', { status: PostStatus.published })
      .orderBy('p.publishedAt', 'DESC');

    if (query.keyword) {
      builder.andWhere('post.title LIKE :title', {
        title: `%${query.keyword}%`,
      });
    }

    if (query.category) {
      builder.andWhere('post.categoryId = :categoryId', {
        categoryId: query.category,
      });
    } else {
      builder.leftJoinAndMapOne('post.category', 'post.category', 'category');
    }

    if (query.tag) {
      builder.leftJoinAndMapMany('post.tag', 'post.tags', 'tag');
      builder.andWhere('tag.id = :tag', { tag: Number(query.tag) });
    }

    const [list, count] = await Promise.all([
      builder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getMany(),
      builder.getCount(),
    ]);
    return {
      list,
      meta: {
        count,
        page,
        pageSize,
      },
    };
  }
}
