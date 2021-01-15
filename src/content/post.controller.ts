import { Controller, Post as PostMethod, Get, Query, Param, Delete, UseGuards, Body } from "@nestjs/common"
import { Post } from "@/entity/post.entity"
import { ApiOperation } from "@nestjs/swagger"
import { PostService, PostNotFound } from "./post.service"
import { APIPrefix } from "@/constants/constants"
import { ParsePagePipe } from "@/core/pipes/parse-page.pipe"
import { MustIntPipe } from "@/core/pipes/must-int.pipe"
import { CurUser } from "@/core/decorators/user.decorator"
import { LikeService } from "./like.service"
import { AuthGuard } from "@/core/guards/auth.guard"

@Controller()
export class PostController {
  constructor(private readonly postService: PostService, private readonly likeService: LikeService) {}

  @ApiOperation({ summary: "文章点赞", tags: ["post"] })
  @PostMethod(`${APIPrefix}/posts/:postId/like`)
  @UseGuards(AuthGuard)
  async like(@CurUser() user, @Param("postId", MustIntPipe) postId: number) {
    await this.likeService.like(postId, user.id)
    return {}
  }

  @ApiOperation({ summary: "取消文章点赞", tags: ["post"] })
  @Delete(`${APIPrefix}/posts/:postId/like`)
  @UseGuards(AuthGuard)
  async cancelLike(@CurUser() user, @Param("postId", MustIntPipe) postId: number) {
    await this.likeService.cancelLike(postId, user.id)
    return {}
  }

  @ApiOperation({ summary: "查看某用户点赞的文章", tags: ["post"] })
  @Get(`${APIPrefix}/posts/users/:userId/like`)
  async userLikePosts(@Param("userId", MustIntPipe) userId: number, @Query("page", ParsePagePipe) page: number) {
    return await this.likeService.userLikePosts(userId, { page })
  }

  @Get(`${APIPrefix}/users/:id/posts`)
  async getPostByUserId(@Param("id") userId: number, @Query("page", ParsePagePipe) page: number) {
    return await this.postService.paginate(page, { userId })
  }

  @Get(`${APIPrefix}/banners`)
  async banner() {
    return await this.postService.bannerList()
  }

  @ApiOperation({ summary: "根据slug查文章", tags: ["post"] })
  @Get(`${APIPrefix}/posts/:slug`)
  async getBySlug(@Param("slug") slug: string) {
    try {
      const post = await this.postService.findBySlug(slug)
      const [prev, next] = await this.postService.findPrevAndNext(post.id, post.publishedAt)
      post.prev = prev
      post.next = next
      return {
        ...post,
        related: [],
        content: post.content ? encodeURIComponent(post.content.html) : "",
      }
    } catch (error) {
      throw PostNotFound
    }
  }

  @ApiOperation({ summary: "查询文章列表" })
  @Get(`${APIPrefix}/posts`)
  list(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("categoryId") categoryId: number,
    @Query("userId") userId: number,
    @Query("tagId") tagId: number,
  ) {
    return this.postService.paginate(page, {
      userId,
      categoryId,
      s,
      tagId,
    })
  }

  @ApiOperation({ summary: "创建文章" })
  @PostMethod(`${APIPrefix}/posts`)
  async store(@Body() post: Post) {
    const data = await this.postService.create(post)
    return { data, message: "文章创建成功" }
  }

  @ApiOperation({ summary: "更新文章" })
  @PostMethod(`${APIPrefix}/posts/:id`)
  async update(@Param("id", MustIntPipe) id: number, @Body() newPost: Post) {
    const data = await this.postService.update(id, newPost)
    return { data, message: "文章更新成功" }
  }
}
