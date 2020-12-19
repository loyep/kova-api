import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { Content } from './content.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export interface ArticleMeta {
  cover: string;
  color: string;
  background: string;
}

export function defaultMeta(): ArticleMeta {
  return {
    cover: '',
    background: '',
    color: '',
  };
}

export enum ArticleStatus {
  published = 'published',
  private = 'private',
  password = 'password',
  draft = 'draft',
}

export enum ArticleCommentType {
  allow = 'allow',
  refuse = 'refuse',
  commented = 'commented',
  logged = 'logged',
}

export enum ArticleType {
  default = 'default',
  // refuse = 'refuse',
  // commented = 'commented',
  // logged = 'logged',
}

@Entity({
  name: 'articles',
  orderBy: {
    publishedAt: 'DESC',
    id: 'DESC',
  },
})
export class Article {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @IsNotEmpty({ message: '文章标题？' })
  @IsString({ message: '字符串？' })
  @Column('varchar', { nullable: true, default: null })
  @Index({ fulltext: true })
  title: string;

  @Column('varchar', { default: ArticleStatus.published })
  @Index()
  status: string;

  @Column('varchar', { nullable: true, default: null, unique: true })
  @Index({ unique: true })
  slug: string;

  @Column('varchar', { nullable: true, default: null })
  image: string | null;

  @Column('varchar', { nullable: true, default: null })
  excerpt: string | null;

  @Column('simple-json', { default: null, select: true })
  meta: ArticleMeta;

  @OneToOne(() => Content, (content: Content) => content.article)
  content: Content | null;

  @Column('bigint', {
    name: 'content_id',
    nullable: true,
    default: 0,
    unsigned: true,
  })
  contentId: number;

  @Column('tinytext', { nullable: true, default: null })
  cover: string | null;

  @Column('varchar', { default: ArticleType.default })
  type: string;

  @Column('int', { name: 'views_count', unsigned: true, default: 0 })
  viewsCount: number;

  @Column('int', { name: 'likes_count', unsigned: true, default: 0 })
  likesCount: number;

  @Column('int', { name: 'comments_count', unsigned: true, default: 0 })
  @Index()
  commentsCount: number;

  @Column('varchar', {
    name: 'comment_type',
    default: ArticleCommentType.allow,
  })
  commentType: string;

  @Column('varchar', { nullable: true, default: null, select: false })
  password: string | null;

  @Column('datetime', { name: 'published_at', nullable: true, default: null })
  @Index()
  publishedAt: Date | null;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @ManyToOne(() => Category, (category: Category) => category.articles, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('bigint', {
    name: 'category_id',
    nullable: true,
    default: null,
    select: false,
  })
  @Index()
  categoryId: number;

  @ManyToOne(() => User, (user: User) => user.articles, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('bigint', {
    name: 'user_id',
    nullable: true,
    default: null,
    select: false,
  })
  @Index()
  userId: number;

  prev: Article | null;

  next: Article | null;

  related: Article[];

  @ManyToMany(() => Tag, (tag: Tag) => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Promise<Tag[]>;

  @ManyToMany(() => User, (user: User) => user.likeArticles)
  @JoinTable({ name: 'likes' })
  likedUsers: Promise<User[]>;
}
