import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, Like } from "typeorm"
import { Category } from "@/entity/category.entity"
import { ListResult } from "@/entity/listresult.entity"
import { paginate } from "@/common"

export const CategoryNotFound = new NotFoundException("未找到分类")

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  all(): Promise<Category[]> {
    return this.repo.find({
      select: ["id", "image", "name", "description", "postsCount"],
      order: {
        createdAt: "DESC",
      },
    } as any)
  }

  async paginate(page: number, { s }: { s?: string } = {}) {
    return await paginate<Category>(
      this.repo,
      { page, pageSize: 20 },
      {
        where: {
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async index(page: number, pageSize: number, { s }: { s?: string } = {}, select?: (keyof Category)[]) {
    return await paginate<Category>(
      this.repo,
      { page, pageSize },
      {
        select,
        where: {
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async list({ page, pageSize = 20 }: { page: number; pageSize?: number }): Promise<ListResult<Category>> {
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

  findBySlug(slug: string) {
    return this.repo.findOneOrFail({
      select: ["id", "image", "name", "description", "postsCount", "slug"],
      where: {
        slug,
      },
      relations: [],
    })
  }

  findById(id: number | string) {
    return this.repo.findOne({
      select: ["id", "image", "name", "description", "postsCount", "slug"],
      where: {
        id,
      },
      relations: [],
    })
  }

  async update(tagId: number | string, newCategory: Category) {
    try {
      const existedUserCount = await this.repo
        .createQueryBuilder()
        .where("id != :id", { id: tagId })
        .andWhere("slug = :slug", { slug: newCategory.slug })
        .getCount()

      if (existedUserCount > 0) {
        throw "别名已被占用"
      }
      const res = await this.repo.update(tagId, newCategory)
      console.log(res)
      return await this.repo.findOneOrFail(tagId)
    } catch (error) {
      console.log(error)
    }
  }
}
