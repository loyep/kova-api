import { APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { ArticleService } from '@/content';
import { MyHttpException } from '@/core/exceptions/my-http.exception';
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe';
import { Controller, Get, Res, Param, Query } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  @Get(`${APIPrefix}/users`)
  async getAll() {
    const users = await this.userService.all();
    return users;
  }

  @Get(`${APIPrefix}/users/:id/article`)
  async getArticleByUserId(@Param('id') id: number, @Query('page', ParsePagePipe) page: number) {
    try {
      const user = await this.articleService.listByUserId(id, { page });
      return user;
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      });
    }
  }

  @Get(`${APIPrefix}/users/:name`)
  async getByName(@Param('name') name: string) {
    try {
      const user = await this.userService.findByName(name);
      return user;
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      });
    }
  }
}
