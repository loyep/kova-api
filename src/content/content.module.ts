import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { User } from '@/entity/user.entity';
import { Article } from '@/entity/article.entity';
import { Category } from '@/entity/category.entity';
import { Tag } from '@/entity/tag.entity';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Tag, Article]),
    CommonModule,
  ],
  controllers: [ArticleController],
  providers: [],
  exports: [],
})
export class ContentModule {}
