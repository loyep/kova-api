import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '@/entity/tag.entity';
import { ListResult } from '@/entity/listresult.entity';

export const TagNotFound = new NotFoundException('未找到标签');

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
  ) {}

  async all(): Promise<Tag[]> {
    const tags: Tag[] = await this.repo.find({
      select: ['id', 'image', 'name', 'description', 'postsCount'],
      order: {
        createdAt: 'DESC',
      },
    } as any);
    return tags;
  }

  async list({ page, pageSize = 20 }: { page: number; pageSize?: number }): Promise<ListResult<Tag>> {
    const [list, count] = await this.repo.findAndCount({
      where: {},
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      list,
      meta: {
        count,
        page,
        pageSize,
        totalPage: Math.ceil(count / pageSize),
      },
    };
  }

  async findBySlug(slug: string) {
    const tag = await this.repo.findOne({
      select: ['id', 'image', 'name', 'description', 'articlesCount', 'slug'],
      where: {
        slug,
      },
      relations: [],
    });
    return tag;
  }

  async findBySlugOrFail(slug: string) {
    const tag = await this.repo.findOneOrFail({
      select: ['id', 'image', 'name', 'description', 'articlesCount', 'slug'],
      where: {
        slug,
      },
      relations: [],
    });
    return tag;
  }

  async findById(id: number) {
    const tag = await this.repo.findOne({
      select: ['id', 'image', 'name', 'description', 'articlesCount', 'slug'],
      where: {
        id,
      },
      relations: [],
    });
    return tag;
  }
}
