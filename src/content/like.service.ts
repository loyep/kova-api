import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserLike } from "@/entity/user-like.entity"
import { LoggerService } from "@/common/logger.service"
import { Post } from "@/entity/post.entity"
import { paginate } from "@/common"

export enum LikeType {
  Post = "post",
  Category = "category",
}

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(UserLike)
    private readonly repo: Repository<UserLike>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    private readonly logger: LoggerService,
  ) {}

  async isLiked(likeId: number, userId: number, type = LikeType.Post): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        like_id: likeId,
        user_id: userId,
        type: type,
      },
    })
    return count > 0
  }

  async like(likeId: number, userId: number, type = LikeType.Post): Promise<boolean> {
    try {
      if (this.isLiked(likeId, userId, type)) {
        this.logger.log({
          data: {
            thecodeline: `like warn ${type} likeId:${likeId} has liked.`,
          },
        })
        return true
      }
      await this.repo.save({
        like_id: likeId,
        user_id: userId,
        type: type,
      })
    } catch (error) {
      //
    }
    return true
  }

  async cancelLike(likeId: number, userId: number, type = LikeType.Post): Promise<boolean> {
    try {
      await this.repo.delete({
        like_id: likeId,
        user_id: userId,
        type: type,
      })
      return true
    } catch (error) {
      return false
    }
  }

  async userLikePosts(userId: number, { page, pageSize = 20 }: { page: number; pageSize?: number }) {
    const builder = this.postRepo
      .createQueryBuilder("a")
      .innerJoinAndSelect("likes", "likes", "likes.like_id = a.id AND likes.user_id = :userId AND likes.type = :type", {
        userId,
        type: LikeType.Post,
      })
      .leftJoinAndSelect("a.user", "user")
      .leftJoinAndSelect("a.category", "category")
    return await paginate<Post>(builder, { page, limit: pageSize })
  }
}
