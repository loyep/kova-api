import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

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

  @Column('bigint', { name: 'posts_count', unsigned: true, default: 0 })
  postsCount: number;

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

  @ManyToMany(() => Post, (post: Post) => post.tags)
  posts: Promise<Post[]>;
}
