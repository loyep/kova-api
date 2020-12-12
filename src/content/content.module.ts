import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@/common/common.module';

// Controllers
import { ArticleController } from './article.controller';
import { CategoryController } from './category.controller';
import { TagController } from './tag.controller';
import { TopicController } from './topic.controller';

// Entities
import { Article } from '@/model/article.entity';
import { Category } from '@/model/category.entity';
import { Tag } from '@/model/tag.entity';
import { Topic } from '@/model/topic.entity';
import { User } from '@/model/user.entity';

// Services
import { ArticleService } from './article.service';
import { CategoryService } from './category.service';
import { TagService } from './tag.service';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Tag, Article, Topic]),
    CommonModule,
  ],
  controllers: [
    CategoryController,
    TagController,
    ArticleController,
    TopicController,
  ],
  providers: [ArticleService, CategoryService, TagService, TopicService],
  exports: [],
})
export class ContentModule {}
