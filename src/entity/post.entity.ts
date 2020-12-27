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
  PrimaryColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { Content } from './content.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export interface PostMeta {
  cover: string;
  color: string;
  background: string;
}

export function defaultMeta(): PostMeta {
  return {
    cover: '',
    background: '',
    color: '',
  };
}

export enum PostStatus {
  published = 'published',
  private = 'private',
  password = 'password',
  draft = 'draft',
}

export enum PostCommentType {
  allow = 'allow',
  refuse = 'refuse',
  commented = 'commented',
  logged = 'logged',
}

export enum PostType {
  default = 'default',
  // refuse = 'refuse',
  // commented = 'commented',
  // logged = 'logged',
}

@Entity({
  name: 'posts',
  orderBy: {
    publishedAt: 'DESC',
    id: 'DESC',
  },
})
export class Post {
  @PrimaryColumn('bigint', { unsigned: true })
  id: number;

  @Column('varchar', { nullable: true, default: null })
  title: string;

  @Column('datetime', { name: 'published_at', nullable: true, default: null })
  publishedAt: Date | null;
}
