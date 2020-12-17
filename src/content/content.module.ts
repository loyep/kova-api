import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@/common/common.module';

// Controllers
import { ArticleController } from './article.controller';
import { CategoryController } from './category.controller';
import { TagController } from './tag.controller';
import { TopicController } from './topic.controller';

// Entities
import { Article } from '@/entity/article.entity';
import { Category } from '@/entity/category.entity';
import { Tag } from '@/entity/tag.entity';
import { Topic } from '@/entity/topic.entity';
import { User } from '@/entity/user.entity';
import { UserLike } from '@/entity/user-like.entity';

// Services
import { ArticleService } from './article.service';
import { CategoryService } from './category.service';
import { TagService } from './tag.service';
import { TopicService } from './topic.service';
import { LikeService } from './like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Tag, Article, Topic, UserLike]),
    CommonModule,
  ],
  controllers: [CategoryController, TagController, ArticleController, TopicController],
  providers: [ArticleService, CategoryService, TagService, TopicService, LikeService],
  exports: [],
})
export class ContentModule {}
