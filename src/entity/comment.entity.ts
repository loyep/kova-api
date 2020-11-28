import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

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
