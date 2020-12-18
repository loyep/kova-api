import { APIPrefix } from '@/constants/constants';
import { ErrorCode } from '@/constants/error';
import { ArticleService } from '@/content';
import { MyHttpException } from '@/core/exceptions/my-http.exception';
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService, private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '用户列表', tags: ['user'] })
  @Get(`${APIPrefix}/categories`)
  async list(@Query('s') s: string, @Query('page', ParsePagePipe) page: number) {
    const data = await this.userService.list({ page });
    return data;
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
