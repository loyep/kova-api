import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity({ name: 'contents' })
export class Content {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('mediumtext', { nullable: true, default: null })
  markdown: string;

  @Column('mediumtext', { nullable: true, default: null })
  html: string;

  @Column('mediumtext', { nullable: true, default: null })
  content: string;

  @Column('varchar', { nullable: true, default: null })
  type: string;

  @OneToOne(() => Article)
  @JoinColumn({ name: 'post_id' })
  artilce?: Article;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at' })
  updatedAt: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;
}
