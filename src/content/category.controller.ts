import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common"
import { CategoryNotFound, CategoryService } from "./category.service"
import { AdminAPIPrefix, APIPrefix } from "@/constants/constants"
import { ApiOperation } from "@nestjs/swagger"
import { LoggerService } from "@/common/logger.service"
import { ParsePagePipe, ParsePageSizePipe } from "@/core/pipes/parse-page.pipe"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { ErrorCode } from "@/constants/error"
import { Category } from "@/entity/category.entity"

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly logger: LoggerService) {}

  @ApiOperation({ summary: "分类列表", tags: ["category"] })
  @Get(`${APIPrefix}/categories`)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.categoryService.paginate(page, { s })
  }

  @ApiOperation({ summary: "根据slug查询分类", tags: ["category"] })
  @Get(`${APIPrefix}/categories/:slug`)
  async showBySlug(@Param("slug") slug: string) {
    try {
      const category = await this.categoryService.findBySlug(slug)
      if (!category) {
        throw CategoryNotFound
      }
      return category
    } catch (error) {
      throw CategoryNotFound
    }
  }

  @ApiOperation({ summary: "查询分类", tags: ["category"] })
  @Get(`${AdminAPIPrefix}/categories/:id`)
  async show(@Param("id") id: number) {
    const category = await this.categoryService.findById(id)
    return category
  }

  // @ApiOperation({ summary: "查询分类", tags: ["category"] })
  @Get(`${AdminAPIPrefix}/category`)
  index(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.categoryService.index(page, pageSize, { s }, [
      "id",
      "image",
      "name",
      "description",
      "postsCount",
      "slug",
      "createdAt",
    ])
  }

  @Get(`${AdminAPIPrefix}/category/:id`)
  async showTag(@Param("id") id: number | string) {
    try {
      const category = await this.categoryService.findById(id)
      return category
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Put(`${AdminAPIPrefix}/category/:id`)
  async updateTag(@Param("id") id: number | string, @Body() category: Category) {
    try {
      return await this.categoryService.update(id, category)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }
}
