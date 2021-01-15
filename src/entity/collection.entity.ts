import { Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "collections" })
export class Collection {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number
  // @PrimaryColumn('varchar')
  // type: string;
  // @PrimaryColumn('bigint', { unsigned: true })
  // like_id: number;
  // @PrimaryColumn('bigint', { unsigned: true })
  // user_id: number;
  // @CreateDateColumn({ name: 'created_at' })
  // createdAt: Date;
}
