import { Controller, Post, Get, Query, Param, Delete, UseGuards, Body } from '@nestjs/common';
import { Article } from '@/entity/article.entity';
import { ApiOperation } from '@nestjs/swagger';
import { ArticleService, ArticleNotFound } from './article.service';
import { APIPrefix } from '@/constants/constants';
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe';
import { MustIntPipe } from '@/core/pipes/must-int.pipe';
import { CurUser } from '@/core/decorators/user.decorator';
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

  @ApiOperation({ summary: '文章点赞', tags: ['article'] })
  @Post(`${APIPrefix}/articles/:id/like`)
  @UseGuards(AuthGuard)
  async like(@CurUser() user, @Param('id', MustIntPipe) id: number) {
    await this.likeService.like(id, user.id);
    return {};
  }

  @ApiOperation({ summary: '取消文章点赞', tags: ['article'] })
  @Delete(`${APIPrefix}/articles/:id/like`)
  @UseGuards(AuthGuard)
  async cancelLike(@CurUser() user, @Param('id', MustIntPipe) id: number) {
    await this.likeService.unLike(id, user.id);
    return {};
  }

  @Get(`${APIPrefix}/banners`)
  async banner() {
    const data = await this.articleService.bannerList();
    return data;
  }

  @ApiOperation({ summary: '根据slug查文章', tags: ['article'] })
  @Get(`${APIPrefix}/articles/:slug`)
  async getBySlug(@Param('slug') slug: string) {
    try {
      const article = await this.articleService.findBySlug(slug);
      const [prev, next] = await this.articleService.findPrevAndNext(article.id, article.publishedAt);
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

  @ApiOperation({ summary: '查询文章列表' })
  @Get(`${APIPrefix}/articles`)
  async list(
    @Query('s') s: string,
    @Query('page', ParsePagePipe) page: number,
    @Query('categoryId') categoryId: number,
    @Query('userId') userId: number,
  ) {
    const sort = 'publishedAt';
    const order: 'DESC' | 'ASC' = 'DESC';
    const data = await this.articleService.list({ sort, order, page, categoryId, userId });
    return data;
  }

  @ApiOperation({ summary: '创建文章' })
  @Post(`${APIPrefix}/articles`)
  async store(@Body() article: Article) {
    const data = await this.articleService.create(article);
    return { data, message: '文章创建成功' };
  }

  @ApiOperation({ summary: '更新文章' })
  @Post(`${APIPrefix}/articles/:id`)
  async update(@Param('id', MustIntPipe) id: number, @Body() newArticle: Article) {
    const data = await this.articleService.update(id, newArticle);
    return { data, message: '文章更新成功' };
  }
}
