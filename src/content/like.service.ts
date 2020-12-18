import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLike } from '@/entity/user-like.entity';
import { LoggerService } from '@/common/logger.service';

export enum LikeType {
  Article = 'article',
  Category = 'category',
}

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(UserLike)
    private readonly repo: Repository<UserLike>,
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

  async unLike(likeId: number, userId: number, type = LikeType.Article): Promise<boolean> {
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
}
