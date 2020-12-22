import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'photos' })
export class Photo {
  @PrimaryColumn('varchar')
  type: string;

  @PrimaryColumn('bigint', { unsigned: true })
  like_id: number;

  @PrimaryColumn('bigint', { unsigned: true })
  user_id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
