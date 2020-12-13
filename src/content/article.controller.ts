import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Res,
  Delete,
} from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { Article } from '@/model/article.entity';
import { ArticleService } from './article.service';
import { APIPrefix } from '@/constants/constants';
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe';
import { MustIntPipe } from '@/core/pipes/must-int.pipe';
import { CurUser } from '@/core/decorators/user.decorator';
import { ErrorCode } from '@/constants/error';
import { MyHttpException } from '@/core/exception/my-http.exception';

@Controller()
export class ArticleController {
  constructor(
    private readonly configService: ConfigService,
    private readonly articleService: ArticleService,
  ) {}

  async getAll() {
    const articles: Article[] = await this.articleService.all();
    return articles;
  }

  @Post(`${APIPrefix}/articles/:id/like`)
  async like(@CurUser() user, @Param('id', MustIntPipe) id: number) {
    await this.articleService.likeOrCancelLike(id, user.id);
    return {};
  }

  @Delete(`${APIPrefix}/articles/:id/like`)
  async cancelLike(@CurUser() user, @Param('id', MustIntPipe) id: number) {
    await this.articleService.likeOrCancelLike(id, user.id);
    return {};
  }

  @Get(`${APIPrefix}/banners`)
  async banner(@Res() res) {
    const data = await this.articleService.bannerList();
    return res.json({
      data,
    });
  }

  @Get(`${APIPrefix}/articles/:slug`)
  async getBySlug(@Param('slug') slug: string, @Res() res) {
    const article = await this.articleService.findBySlug(slug);
    try {
      const [prev, next] = await this.articleService.findNextAndPost(
        article.id,
        article.publishedAt,
      );
      article.prev = prev;
      article.next = next;
      return res.json({
        code: ErrorCode.SUCCESS.CODE,
        data: {
          ...article,
          related: [],
          content: article.content
            ? encodeURIComponent(article.content.html)
            : '',
        },
      });
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      });
    }
  }

  @Get(`${APIPrefix}/articles`)
  async list(
    @Query('s') s: string,
    @Query('page', ParsePagePipe) page: number,
    @Query('category') category: string | number,
    @Query('tag') tag: string | number,
    @Res() res,
  ) {
    const pageSize = 20;
    const sort = 'publishedAt';
    const order: 'DESC' | 'ASC' = 'DESC';
    const data = await this.articleService.list(sort, order, page, pageSize);

    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      data,
    });
  }
}
