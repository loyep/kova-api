import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThan, MoreThan } from 'typeorm';
import { Article, ArticleStatus } from '@/entity/article.entity';
import { ListResult } from '@/entity/listresult.entity';
import { defaultMeta } from '@/entity/category.entity';

export const ArticleNotFound = new NotFoundException('未找到文章');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>,
  ) {}

  async all(): Promise<Article[]> {
    const articles: Article[] = await this.repo.find({
      select: ['id', 'image', 'name', 'description'],
      order: {
        createdAt: 'DESC',
      },
    } as any);
    return articles;
  }

  async listByUserId(
    userId: number,
    {
      page,
      pageSize,
    }: {
      page: number;
      pageSize?: number;
    },
  ) {
    return await this.list({ userId, page, pageSize });
  }

  // 创建文章
  // public async create(newArticle: Article): Promise<Article> {
  //   const article = await this.repo.create({
  //     ...newArticle,
  //     meta: getDefaultMeta(),
  //   });
  //   this.seoService.push(getArticleUrl(article.id));
  //   this.syndicationService.updateCache();
  //   this.tagService.updateListCache();
  //   return article;
  // }

  // // 修改文章
  // public async update(articleId: Types.ObjectId, newArticle: Article): Promise<Article> {
  //   // 修正信息
  //   Reflect.deleteProperty(newArticle, 'meta');
  //   Reflect.deleteProperty(newArticle, 'create_at');
  //   Reflect.deleteProperty(newArticle, 'update_at');

  //   const article = await this.articleModel.findByIdAndUpdate(articleId, newArticle, { new: true }).exec();
  //   this.seoService.update(getArticleUrl(article.id));
  //   this.syndicationService.updateCache();
  //   this.tagService.updateListCache();
  //   return article;
  // }

  async list({
    sort = 'publishedAt',
    page,
    pageSize = 20,
    order = 'DESC',
    userId,
    categoryId,
  }: {
    sort?: string;
    order?: 'DESC' | 'ASC';
    page: number;
    userId?: number;
    categoryId?: number;
    pageSize?: number;
  }): Promise<ListResult<Article>> {
    const [list, count] = await this.repo.findAndCount({
      where: {
        status: ArticleStatus.published,
        ...(userId ? { userId } : {}),
        ...(categoryId ? { categoryId } : {}),
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
        totalPage: Math.ceil(count / pageSize),
      },
    };
  }

  async bannerList() {
    const data = await this.repo.find({
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

  async findBySlug(slug: string, status: ArticleStatus = ArticleStatus.published) {
    const article = await this.repo.findOneOrFail({
      where: {
        slug,
        status,
      },
      relations: ['category', 'user', 'content'],
    });

    if (article && !article.meta) {
      article.meta = defaultMeta;
      await this.repo.save(article);
    } else {
      article.meta = { ...defaultMeta, ...article.meta };
    }
    return article;
  }

  async findById(id: number, status: ArticleStatus = ArticleStatus.published) {
    const article = await this.repo.findOneOrFail({
      where: {
        id,
        status,
      },
      relations: ['category', 'user', 'content'],
    });

    if (article && !article.meta) {
      article.meta = defaultMeta;
      await this.repo.save(article);
    } else {
      article.meta = { ...defaultMeta, ...article.meta };
    }
    return article;
  }

  // 创建文章
  async create(newArticle: Article): Promise<Article> {
    const article = await this.repo.save({
      ...newArticle,
      meta: defaultMeta,
    });
    return await this.repo.findOne(article.id);
  }

  // 更新文章
  async update(articleId: number, newArticle: Article): Promise<Article> {
    try {
      delete newArticle.id;
      delete newArticle.content;
      await this.repo.update(articleId, {
        ...newArticle,
      });
      return this.findById(articleId);
    } catch (error) {
      console.error(error);
    }
  }

  async findPrevAndNext(id: number, publishedAt: Date): Promise<any> {
    try {
      return await Promise.all([
        this.repo.findOne({
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
        this.repo.findOne({
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
      return [null, null];
    }
  }
}
