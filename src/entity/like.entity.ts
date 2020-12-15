import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'likes' })
export class Like {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { nullable: true, default: null })
  type: string;

  @Column('bigint', { unsigned: true })
  article_id: number;

  @Column('bigint', { unsigned: true })
  user_id: number;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at' })
  updatedAt: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;
}
