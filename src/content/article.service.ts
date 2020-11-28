import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Article } from '@/entity/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async all(): Promise<Article[]> {
    const articles: Article[] = await this.articleRepository.find({
      select: ['id', 'image', 'name', 'description'],
      order: {
        createdAt: 'DESC',
      },
    } as any);
    return articles;
  }
}
