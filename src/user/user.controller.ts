import { AdminAPIPrefix, APIPrefix } from "@/constants/constants"
import { ErrorCode } from "@/constants/error"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { ParsePagePipe, ParsePageSizePipe } from "@/core/pipes/parse-page.pipe"
import { User } from "@/entity/user.entity"
import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"
import { UserService } from "./user.service"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "用户列表", tags: ["user"] })
  @Get(`${APIPrefix}/users`)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.userService.paginate(page, { s })
  }

  @ApiOperation({ summary: "管理后台用户列表", tags: ["user"] })
  @Get(`${APIPrefix}/users`)
  get(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return this.userService.paginate(page, { s })
  }

  @Get(`${APIPrefix}/users/:name`)
  async getByName(@Param("name") name: string) {
    try {
      const user = await this.userService.findByName(name)
      return user
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  // @ApiOperation({ summary: "查询分类", tags: ["category"] })
  @Get(`${AdminAPIPrefix}/user`)
  index(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.userService.index(page, pageSize, { s }, [
      "id",
      "image",
      "name",
      "displayName",
      "email",
      "avatar",
      "status",
      "createdAt",
    ])
  }

  @Get(`${AdminAPIPrefix}/user/:id`)
  async showUser(@Param("id") id: number | string) {
    try {
      const user = await this.userService.findById(id)
      console.log(user)
      return user
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Put(`${AdminAPIPrefix}/user/:id`)
  async updateUser(@Param("id") id: number | string, @Body() user: User) {
    try {
      const res = await this.userService.update(id, user)
      console.log(res)
      return res
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }
}
