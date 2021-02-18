import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Repository } from "typeorm"
import { Topic } from "@/entity/topic.entity"
import { paginate } from "@/common"

export const TopicNotFound = new NotFoundException("未找到专题")

@Injectable()
export class TopicService {
  static readonly select: (keyof Topic)[] = ["id", "image", "name", "description", "postsCount", "slug"]

  constructor(
    @InjectRepository(Topic)
    private readonly repo: Repository<Topic>,
  ) {}

  async all(): Promise<Topic[]> {
    const topics: Topic[] = await this.repo.find({
      select: ["id", "image", "name", "description", "postsCount"],
      order: {
        createdAt: "DESC",
      },
    } as any)
    return topics
  }

  async paginate(page: number, { s }: { s?: string } = {}) {
    return await paginate<Topic>(
      this.repo,
      { page, pageSize: 20 },
      {
        where: {
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async index(page: number, pageSize: number, { s }: { s?: string } = {}, select?: (keyof Topic)[]) {
    return await paginate<Topic>(
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

  async findBySlug(slug: string, select: (keyof Topic)[] = TopicService.select) {
    return await this.repo.findOneOrFail({
      select,
      where: {
        slug,
      },
      relations: [],
    })
  }

  async findById(id: number, select: (keyof Topic)[] = TopicService.select) {
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
