import * as _ from 'lodash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '@/entity/topic.entity';

export const TopicNotFound = new NotFoundException('未找到专题');

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly repo: Repository<Topic>,
  ) {}

  async all(): Promise<Topic[]> {
    const topics: Topic[] = await this.repo.find({
      select: ['id', 'image', 'name', 'description', 'postsCount'],
      order: {
        createdAt: 'DESC',
      },
    } as any);
    return topics;
  }

  async findBySlug(slug: string) {
    const category = await this.repo.findOne({
      select: ['id', 'image', 'name', 'description', 'articlesCount', 'slug'],
      where: {
        slug,
      },
      relations: [],
    });
    return category;
  }

  async findById(id: number) {
    const category = await this.repo.findOneOrFail({
      select: ['id', 'image', 'name', 'description', 'articlesCount', 'slug'],
      where: {
        id,
      },
      relations: [],
    });
    return category;
  }
}
