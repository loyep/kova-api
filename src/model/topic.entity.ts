import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'topics' })
export class Topic {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar', { unique: true })
  slug: string;

  @Column('varchar', { nullable: true, default: null })
  description?: string;

  @Column('varchar', { nullable: true, default: null })
  image?: string;

  @Column('bigint', { name: 'articles_count', unsigned: true, default: 0 })
  articlesCount: number;

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
}
