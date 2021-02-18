import { AdminAPIPrefix, APIPrefix } from "../constants/constants"
import { Controller, Get, Query, Param, Put, Body } from "@nestjs/common"
import { TagService, TagNotFound } from "./tag.service"
import { ApiOperation } from "@nestjs/swagger"
import { ParsePagePipe, ParsePageSizePipe } from "@/core/pipes/parse-page.pipe"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { ErrorCode } from "@/constants/error"
import { Tag } from "@/entity/tag.entity"

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: "标签列表", tags: ["tag"] })
  @Get(`${APIPrefix}/tags`)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.tagService.paginate(page, { s })
  }

  @ApiOperation({ summary: "根据slug查标签", tags: ["tag"] })
  @Get(`${APIPrefix}/tags/:slug`)
  async showBySlug(@Param("slug") slug: string) {
    try {
      const tag = await this.tagService.findBySlug(slug)
      if (!tag) {
        throw TagNotFound
      }
      return tag
    } catch (error) {
      throw TagNotFound
    }
  }

  // @ApiOperation({ summary: "查询分类", tags: ["category"] })
  @Get(`${AdminAPIPrefix}/tag`)
  index(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.tagService.index(page, pageSize, { s }, ["id", "image", "name", "slug", "description", "createdAt"])
  }

  @Get(`${AdminAPIPrefix}/tag/:id`)
  async showTag(@Param("id") id: number | string) {
    try {
      const tag = await this.tagService.findById(id)
      return tag
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Put(`${AdminAPIPrefix}/tag/:id`)
  async updateTag(@Param("id") id: number | string, @Body() tag: Tag) {
    try {
      return await this.tagService.update(id, tag)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }
}
