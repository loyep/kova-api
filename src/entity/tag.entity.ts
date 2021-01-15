import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Post } from "./post.entity"

export interface TagMeta {
  cover: string
  color: string
  background: string
}

export const defaultMeta: TagMeta = {
  cover: "",
  background: "",
  color: "",
}

@Entity({ name: "tags" })
export class Tag {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number

  @Column("varchar", { unique: true })
  name: string

  @Column("varchar", { unique: true })
  slug: string

  @Column("tinytext", { nullable: true, default: null })
  description?: string

  @Column("varchar", { nullable: true, default: null })
  image: string | null

  @Column("simple-json", { default: null, select: true })
  meta: TagMeta

  @Column("bigint", { name: "posts_count", unsigned: true, default: 0 })
  postsCount: number

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date

  @ManyToMany(() => Post, (post: Post) => post.tags)
  posts: Promise<Post[]>
}
