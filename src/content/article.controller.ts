import { Controller, Post, Get, Query, Param, Res, Delete, UseGuards } from '@nestjs/common';
import { Article } from '@/entity/article.entity';
import { ArticleService, ArticleNotFound } from './article.service';
import { APIPrefix } from '@/constants/constants';
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe';
import { MustIntPipe } from '@/core/pipes/must-int.pipe';
import { CurUser } from '@/core/decorators/user.decorator';
import { ErrorCode } from '@/constants/error';
import { LikeService } from './like.service';
import { LoggerService } from '@/common/logger.service';
import { AuthGuard } from '@/core/guards/auth.guard';

@Controller()
export class ArticleController {
  constructor(
    private readonly logger: LoggerService,
    private readonly articleService: ArticleService,
    private readonly likeService: LikeService,
  ) {}

  async getAll() {
    const articles: Article[] = await this.articleService.all();
    return articles;
  }

  @Post(`${APIPrefix}/articles/:id/like`)
  @UseGuards(AuthGuard)
  async like(@CurUser() user, @Param('id', MustIntPipe) id: number) {
    await this.articleService.likeOrCancelLike(id, user.id);
    return {};
  }

  @Delete(`${APIPrefix}/articles/:id/like`)
  @UseGuards(AuthGuard)
  async cancelLike(@CurUser() user, @Param('id', MustIntPipe) id: number) {
    await this.articleService.likeOrCancelLike(id, user.id);
    return {};
  }

  @Get(`${APIPrefix}/banners`)
  async banner() {
    const data = await this.articleService.bannerList();
    return data;
  }

  @Get(`${APIPrefix}/articles/:slug`)
  async getBySlug(@Param('slug') slug: string) {
    try {
      const article = await this.articleService.findBySlug(slug);
      const [prev, next] = await this.articleService.findPrevAndNext(
        article.id,
        article.publishedAt,
      );
      article.prev = prev;
      article.next = next;
      return {
        ...article,
        related: [],
        content: article.content ? encodeURIComponent(article.content.html) : '',
      };
    } catch (error) {
      throw ArticleNotFound;
    }
  }

  // @Get(`${APIPrefix}/articles-like`)
  // async testLikeArticle(@Req() req) {
  //   req.session.userId = 1;
  //   // console.log(req.session.cookie);
  //   const res = await this.likeService.like(1, 2);
  //   return res;
  // }
  @Get(`${APIPrefix}/articles-like`)
  @UseGuards(AuthGuard)
  async testLikeArticle(@CurUser() user) {
    const res = await this.likeService.like(1, user.id);
    return res;
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
    const data = await this.articleService.list(sort, order, page, pageSize);
    return data;
  }
}
