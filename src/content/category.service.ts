import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@/model/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async all(): Promise<Category[]> {
    const categories: Category[] = await this.categoryRepository.find({
      select: ['id', 'image', 'name', 'description', 'postsCount'],
      order: {
        createdAt: 'DESC',
      },
    } as any);
    return categories;
  }

  async isExists(id: number): Promise<boolean> {
    const category = await this.categoryRepository.findOne({
      select: ['id'],
      where: { id },
    });
    return !!category;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      select: ['id', 'image', 'name', 'description', 'articlesCount', 'slug'],
      where: {
        slug,
      },
      relations: [],
    });
    return category;
  }

  async findById(id: number) {
    const category = await this.categoryRepository.findOne({
      select: ['id', 'image', 'name', 'description', 'articlesCount', 'slug'],
      where: {
        id,
      },
      relations: [],
    });
    return category;
  }
}
