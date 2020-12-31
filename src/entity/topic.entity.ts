import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "topics" })
export class Topic {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number

  @Column("varchar", { unique: true })
  name: string

  @Column("varchar", { unique: true })
  slug: string

  @Column("varchar", { nullable: true, default: null })
  description?: string

  @Column("varchar", { nullable: true, default: null })
  image?: string

  @Column("bigint", { name: "articles_count", unsigned: true, default: 0 })
  articlesCount: number

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date
}
