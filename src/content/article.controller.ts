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
import { Article } from '@/entity/article.entity';
import { ArticleService } from './article.service';
import { APIPrefix } from '@/constants/constants';
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe';
import { MustIntPipe } from '@/core/pipes/must-int.pipe';
import { CurUser } from '@/core/decorators/user.decorator';

@Controller()
export class ArticleController {
  constructor(
    private readonly configService: ConfigService,
    private readonly articleService: ArticleService,
  ) {}

  @Get('/p/:slug')
  async getPost(@Param('slug') slug: string, @Res() res) {
    return;
  }

  async all() {
    const articles: Article[] = await this.articleService.all();
    return articles;
  }

  @Post(`${APIPrefix}/articles/:id/like`)
  async like(@CurUser() user, @Param('id', MustIntPipe) id: number) {
    await this.articleService.likeOrCancelLike(id, user.id);
    return {};
  }

  @Post(`${APIPrefix}/articles/:id/unlike`)
  async cancelLike(@CurUser() user, @Param('id', MustIntPipe) id: number) {
    await this.articleService.likeOrCancelLike(id, user.id);
    return {};
  }

  @Get(`${APIPrefix}/banner`)
  async banner(@Res() res) {
    const data = await this.articleService.bannerList();
    return res.json({
      data,
    });
  }

  @Get(`${APIPrefix}/article/:slug`)
  async getBySlug(@Param('slug') slug: string) {
    const article = await this.articleService.findBySlug(slug);
    try {
      const [prev, next] = await this.articleService.findNextAndPost(
        article.id,
        article.publishedAt,
      );
      console.log(prev);
      console.log(next);
      article.prev = prev;
      article.next = next;
      return {
        data: {
          ...article,
          related: [],
          content: article.content
            ? encodeURIComponent(article.content.html)
            : '',
        },
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get(`${APIPrefix}/articles`)
  async list(
    @Query('s') s: string,
    @Query('page', ParsePagePipe) page: number,
    @Query('category') category: string | number,
    @Query('tag') tag: string | number,
  ) {
    const pageSize = 20;
    const sort = 'publishedAt';
    const order: 'DESC' | 'ASC' = 'DESC';
    const articles = await this.articleService.list(
      sort,
      order,
      page,
      pageSize,
    );

    return articles;
  }
}
