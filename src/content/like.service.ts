import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLike } from '@/entity/user-like.entity';
import { LoggerService } from '@/common/logger.service';
import { Article } from '@/entity/article.entity';
import { paginate } from '@/common';

export enum LikeType {
  Article = 'article',
  Category = 'category',
}

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(UserLike)
    private readonly repo: Repository<UserLike>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    private readonly logger: LoggerService,
  ) {}

  async isLiked(likeId: number, userId: number, type = LikeType.Article): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        like_id: likeId,
        user_id: userId,
        type: type,
      },
    });
    return count > 0;
  }

  async like(likeId: number, userId: number, type = LikeType.Article): Promise<boolean> {
    try {
      if (this.isLiked(likeId, userId, type)) {
        this.logger.info({
          data: {
            thecodeline: `like warn ${type} likeId:${likeId} has liked.`,
          },
        });
        return true;
      }
      await this.repo.save({
        like_id: likeId,
        user_id: userId,
        type: type,
      });
    } catch (error) {
      //
    }
    return true;
  }

  async cancelLike(likeId: number, userId: number, type = LikeType.Article): Promise<boolean> {
    try {
      await this.repo.delete({
        like_id: likeId,
        user_id: userId,
        type: type,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async userLikeArticles(userId: number, { page, pageSize = 20 }: { page: number; pageSize?: number }) {
    const builder = this.articleRepo
      .createQueryBuilder('a')
      .innerJoinAndSelect('likes', 'likes', 'likes.like_id = a.id AND likes.user_id = :userId AND likes.type = :type', {
        userId,
        type: LikeType.Article,
      })
      .leftJoinAndSelect('a.user', 'user')
      .leftJoinAndSelect('a.category', 'category');
    return await paginate<Article>(builder, { page, limit: pageSize });
  }
}
