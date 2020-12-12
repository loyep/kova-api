import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThan, MoreThan } from 'typeorm';
import { Article, ArticleStatus } from '@/model/article.entity';
import { ListResult } from '@/model/listresult.entity';
import { MyHttpException } from '@/core/exception/my-http.exception';
import { ErrorCode } from '@/constants/error';
import { defaultMeta } from '@/model/category.entity';

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

  async list(
    sort: string,
    order: 'DESC' | 'ASC' = 'DESC',
    page: number,
    pageSize: number,
  ): Promise<ListResult<Article>> {
    const [list, count] = await this.articleRepository.findAndCount({
      where: {
        status: ArticleStatus.published,
      },
      order: {
        [sort]: order,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      list,
      meta: {
        count,
        page,
        pageSize,
      },
    };
  }

  async bannerList() {
    const data = await this.articleRepository.find({
      select: ['id'],
      where: {
        status: ArticleStatus.published,
      },
      take: 5,
      order: {
        publishedAt: 'DESC',
      },
    });
    return data;
  }

  async findBySlug(
    slug: string,
    status: ArticleStatus = ArticleStatus.published,
  ) {
    const article = await this.articleRepository.findOne({
      where: {
        slug,
        status,
      },
      relations: ['category', 'user', 'content'],
    });

    if (article && !article.meta) {
      article.meta = defaultMeta;
      await this.articleRepository.save(article);
    } else {
      article.meta = { ...defaultMeta, ...article.meta };
    }
    return article;
  }

  async isUserLiked(articleId: number, userID: number): Promise<boolean> {
    const sql = `SELECT article_id, user_id FROM like_articles
        WHERE article_id = ${articleId} AND user_id = ${userID}`;
    let result = await this.articleRepository.manager.query(sql);
    result = result || [];
    if (result.length) {
      return true;
    }
    return false;
  }

  async findNextAndPost(id: number, publishedAt: Date): Promise<any> {
    try {
      return await Promise.all([
        this.articleRepository.findOne({
          select: ['id', 'image', 'slug', 'title'],
          order: {
            publishedAt: 'ASC',
          },
          where: {
            id: Not(id),
            status: ArticleStatus.published,
            publishedAt: MoreThan(publishedAt),
          },
        }),
        this.articleRepository.findOne({
          select: ['id', 'image', 'slug', 'title'],
          order: {
            publishedAt: 'DESC',
          },
          where: {
            id: Not(id),
            status: ArticleStatus.published,
            publishedAt: LessThan(publishedAt),
          },
        }),
      ]);
    } catch (error) {
      console.log(error);
    }
    return [null, null];
  }

  async likeOrCancelLike(articleId: number, userId: number) {
    const [userLiked, article] = await Promise.all([
      this.isUserLiked(articleId, userId),
      this.articleRepository.findOne({
        select: ['id', 'userId'],
        where: { id: articleId },
      }),
    ]);

    if (!article) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
        message: ErrorCode.ParamsError.MESSAGE,
      });
    }
    await this.articleRepository.manager.connection.transaction(
      async (manager) => {
        if (userLiked) {
          const cancelSQL1 = `DELETE FROM like_articles WHERE article_id = ? AND user_id = ?`;
          const cancelSQL2 = `UPDATE articles SET liked_count = liked_count - 1 WHERE id = ?`;
          const cancelSQL3 = `UPDATE users SET liked_count = liked_count - 1 WHERE id = ?`;
          await manager.query(cancelSQL1, [articleId, userId]);
          await manager.query(cancelSQL2, [articleId]);
          await manager.query(cancelSQL3, [article.userId]);
          return;
        }
        const sql1 = `INSERT INTO like_articles (user_id, article_id, publisher, created_at) VALUES (?, ?, ?, ?)`;
        const sql2 = `UPDATE articles SET liked_count = liked_count + 1 WHERE id = ${articleId}`;
        const sql3 = `UPDATE users SET liked_count = liked_count + 1 WHERE id = ?`;
        await manager.query(sql1, [
          userId,
          articleId,
          article.userId,
          new Date(),
        ]);
        await manager.query(sql2, [articleId]);
        await manager.query(sql3, [article.userId]);
      },
    );
  }
}
