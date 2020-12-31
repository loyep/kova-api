import { APIPrefix, AdminAPIPrefix } from "../constants/constants"
import { Controller, Get, Query, Param } from "@nestjs/common"
import { TagService, TagNotFound } from "./tag.service"
import { ApiOperation } from "@nestjs/swagger"
import { ParsePagePipe } from "@/core/pipes/parse-page.pipe"

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
}
