import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from './post.entity';

export interface CategoryMeta {
  cover: string;
  color: string;
  background: string;
}

export const defaultMeta: CategoryMeta = {
  cover: '',
  background: '',
  color: '',
};

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { unique: true })
  slug: string;

  @Column('tinytext', { nullable: true, default: null })
  description?: string;

  @Column('varchar', { nullable: true, default: null })
  image: string | null;

  @Column('simple-json', { default: null, select: true })
  meta: CategoryMeta;

  @Column('bigint', { name: 'posts_count', unsigned: true, default: 0 })
  postsCount: number;

  @Column('datetime', { name: 'created_at', select: false })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at', select: false })
  updatedAt: Date;

  @Column('datetime', {
    name: 'deleted_at',
    nullable: true,
    default: null,
    select: false,
  })
  deletedAt: Date;

  @OneToMany(() => Post, (post: Post) => post.category)
  posts: Promise<Post[]>;
}
