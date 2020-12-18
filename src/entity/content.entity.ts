import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
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

  @OneToOne(() => Article, (article: Article) => article.content)
  @JoinColumn({ name: 'article_id' })
  article?: Article;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
