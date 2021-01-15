import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, Not, LessThan, MoreThan } from "typeorm"
import { Post, PostStatus } from "@/entity/post.entity"
import { defaultMeta } from "@/entity/category.entity"
import { IPaginatorOptions, paginate } from "@/common"

export const PostNotFound = new NotFoundException("未找到文章")

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {}

  async all(): Promise<Post[]> {
    const posts: Post[] = await this.repo.find({
      select: ["id", "image", "name", "description"],
      order: {
        createdAt: "DESC",
      },
    } as any)
    return posts
  }

  listByUserId(
    userId: number,
    {
      page,
    }: {
      page: number
    },
  ) {
    return this.paginate(page, { userId })
  }

  // 创建文章
  // public async create(newPost: Post): Promise<Post> {
  //   const post = await this.repo.create({
  //     ...newPost,
  //     meta: getDefaultMeta(),
  //   });
  //   this.seoService.push(getPostUrl(post.id));
  //   this.syndicationService.updateCache();
  //   this.tagService.updateListCache();
  //   return post;
  // }

  // // 修改文章
  // public async update(postId: Types.ObjectId, newPost: Post): Promise<Post> {
  //   // 修正信息
  //   Reflect.deleteProperty(newPost, 'meta');
  //   Reflect.deleteProperty(newPost, 'create_at');
  //   Reflect.deleteProperty(newPost, 'update_at');

  //   const post = await this.postModel.findByIdAndUpdate(postId, newPost, { new: true }).exec();
  //   this.seoService.update(getPostUrl(post.id));
  //   this.syndicationService.updateCache();
  //   this.tagService.updateListCache();
  //   return post;
  // }
  paginate(
    paginator: IPaginatorOptions,
    {
      s,
      userId,
      categoryId,
      tagId,
      status = PostStatus.published,
    }: { s?: string; userId?: number; categoryId?: number; tagId?: number; status?: PostStatus } = {},
  ) {
    const builder = this.repo
      .createQueryBuilder("a")
      .leftJoinAndSelect("a.user", "user")
      .where("a.status = :status", { status })

    if (categoryId) {
      builder.andWhere("a.category_id = :categoryId", { categoryId })
    } else {
      builder.leftJoinAndSelect("a.category", "category")
    }
    if (userId) builder.andWhere("a.user_id = :userId", { userId })
    if (s) builder.andWhere("a.title like :title", { title: `%${s}%` })
    if (tagId) builder.leftJoin("a.tags", "tag").andWhere("tag.id = :tagId", { tagId })

    return paginate<Post>(builder, paginator)
  }

  async bannerList() {
    const data = await this.repo.find({
      select: ["id", "image", "slug", "title"],
      where: {
        status: PostStatus.published,
        image: Not(null),
      },
      take: 5,
      order: {
        publishedAt: "DESC",
      },
    })
    return data
  }

  async findBySlug(slug: string, status: PostStatus = PostStatus.published) {
    const post = await this.repo.findOneOrFail({
      where: {
        slug,
        status,
      },
      relations: ["category", "user", "content"],
    })
    post.meta = { ...defaultMeta, ...post.meta }
    return post
  }

  async findById(id: number, status: PostStatus = PostStatus.published) {
    const post = await this.repo.findOneOrFail({
      where: {
        id,
        status,
      },
      relations: ["category", "user", "content"],
    })
    post.meta = { ...defaultMeta, ...post.meta }
    return post
  }

  // 创建文章
  async create(newPost: Post): Promise<Post> {
    const post = await this.repo.save({
      ...newPost,
      meta: defaultMeta,
    })
    return await this.repo.findOne(post.id)
  }

  // 更新文章
  async update(postId: number, newPost: Post): Promise<Post> {
    try {
      delete newPost.id
      delete newPost.content
      await this.repo.update(postId, {
        ...newPost,
      })
      return this.findById(postId)
    } catch (error) {
      console.error(error)
    }
  }

  async findPrevAndNext(id: number, publishedAt: Date): Promise<any> {
    const select: (keyof Post)[] = ["id", "image", "slug", "title"]
    try {
      return await Promise.all([
        this.repo.findOne({
          select,
          order: {
            publishedAt: "ASC",
          },
          where: {
            id: Not(id),
            status: PostStatus.published,
            publishedAt: MoreThan(publishedAt),
          },
        }),
        this.repo.findOne({
          select,
          order: {
            publishedAt: "DESC",
          },
          where: {
            id: Not(id),
            status: PostStatus.published,
            publishedAt: LessThan(publishedAt),
          },
        }),
      ])
    } catch (error) {
      return [null, null]
    }
  }
}
