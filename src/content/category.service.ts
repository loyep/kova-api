import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '@/entity/category.entity';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';

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
}
