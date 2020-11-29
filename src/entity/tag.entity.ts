import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.entity';

export interface TagMeta {
  cover: string;
  color: string;
  background: string;
}

export const defaultMeta: TagMeta = {
  cover: '',
  background: '',
  color: '',
};

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar', { unique: true })
  slug: string;

  @Column('tinytext', { nullable: true, default: null })
  description?: string;

  @Column('varchar', { nullable: true, default: null })
  image: string | null;

  @Column('simple-json', { default: null, select: true })
  meta: TagMeta;

  @Column('bigint', { name: 'articles_count', unsigned: true, default: 0 })
  articlesCount: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'NOW()',
    select: false,
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'NOW()',
    select: false,
  })
  updatedAt: Date;

  @Column('datetime', {
    name: 'deleted_at',
    nullable: true,
    default: null,
    select: false,
  })
  deletedAt: Date;

  @ManyToMany(() => Article, (article: Article) => article.tags)
  articles: Promise<Article[]>;
}
