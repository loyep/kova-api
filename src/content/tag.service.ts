import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Repository } from "typeorm"
import { Tag } from "@/entity/tag.entity"
import { ListResult } from "@/entity/listresult.entity"
import { paginate } from "@/common"

export const TagNotFound = new NotFoundException("未找到标签")

@Injectable()
export class TagService {
  static readonly select: (keyof Tag)[] = ["id", "image", "name", "description", "articlesCount", "slug"]

  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
  ) {}

  async all(): Promise<Tag[]> {
    const tags: Tag[] = await this.repo.find({
      select: ["id", "image", "name", "description", "postsCount"],
      order: {
        createdAt: "DESC",
      },
    } as any)
    return tags
  }

  async paginate(page: number, { s }: { s?: string } = {}) {
    return await paginate<Tag>(
      this.repo,
      { page, limit: 20 },
      {
        where: {
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async list({ page, pageSize = 20 }: { page: number; pageSize?: number }): Promise<ListResult<Tag>> {
    const [list, count] = await this.repo.findAndCount({
      where: {},
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
    return {
      list,
      meta: {
        count,
        page,
        pageSize,
        totalPage: Math.ceil(count / pageSize),
      },
    }
  }

  async findBySlug(slug: string, select: (keyof Tag)[] = TagService.select) {
    return await this.repo.findOneOrFail({
      select,
      where: {
        slug,
      },
      relations: [],
    })
  }

  async findById(id: number, select: (keyof Tag)[] = TagService.select) {
    const tag = await this.repo.findOne({
      select,
      where: {
        id,
      },
      relations: [],
    })
    return tag
  }
}
