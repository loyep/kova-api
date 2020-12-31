import { CreateDateColumn, Entity, PrimaryColumn } from "typeorm"

@Entity({ name: "likes" })
export class UserLike {
  @PrimaryColumn("varchar")
  type: string

  @PrimaryColumn("bigint", { unsigned: true })
  like_id: number

  @PrimaryColumn("bigint", { unsigned: true })
  user_id: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}
