import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThan, MoreThan, Like } from 'typeorm';
import { Article, ArticleStatus } from '@/entity/article.entity';
import { defaultMeta } from '@/entity/category.entity';
import { IPaginatorOptions, paginate } from '@/common';

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

  listByUserId(
    userId: number,
    {
      page,
    }: {
      page: number;
    },
  ) {
    return this.paginate(page, { userId });
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
  paginate(
    paginator: IPaginatorOptions,
    {
      s,
      userId,
      categoryId,
      tagId,
      status = ArticleStatus.published,
    }: { s?: string; userId?: number; categoryId?: number; tagId?: number; status?: ArticleStatus } = {},
  ) {
    const builder = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.user', 'user')
      .where('a.status = :status', { status });

    if (categoryId) {
      builder.andWhere('a.category_id = :categoryId', { categoryId });
    } else {
      builder.leftJoinAndSelect('a.category', 'category');
    }
    if (userId) builder.andWhere('a.user_id = :userId', { userId });
    if (s) builder.andWhere('a.title like :title', { title: `%${s}%` });
    if (tagId) builder.leftJoin('a.tags', 'tag').andWhere('tag.id = :tagId', { tagId });

    return paginate<Article>(builder, paginator);
  }

  async bannerList() {
    const data = await this.repo.find({
      select: ['id', 'image', 'slug', 'title'],
      where: {
        status: ArticleStatus.published,
        image: Not(null),
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
    article.meta = { ...defaultMeta, ...article.meta };
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
    article.meta = { ...defaultMeta, ...article.meta };
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
    const select: (keyof Article)[] = ['id', 'image', 'slug', 'title'];
    try {
      return await Promise.all([
        this.repo.findOne({
          select,
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
          select,
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
