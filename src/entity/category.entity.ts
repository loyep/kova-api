import { IsNotEmpty, IsString } from "class-validator"
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm"
import { Post } from "./post.entity"

export interface CategoryMeta {
  cover: string
  color: string
  background: string
}

export const defaultMeta: CategoryMeta = {
  cover: "",
  background: "",
  color: "",
}

@Entity({
  name: "categories",
  orderBy: {
    id: "DESC",
  },
})
export class Category {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number

  @Column("varchar")
  @IsNotEmpty({ message: "分类名称？" })
  @IsString({ message: "字符串？" })
  name: string

  @Column("varchar", { unique: true })
  slug: string

  @Column("tinytext", { nullable: true, default: null })
  description?: string

  @Column("varchar", { nullable: true, default: null })
  image: string | null

  @Column("simple-json", { default: null, select: true })
  meta: CategoryMeta

  @Column("bigint", { name: "posts_count", unsigned: true, default: 0 })
  postsCount: number

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date

  @OneToMany(() => Post, (post: Post) => post.category)
  posts: Promise<Post[]>
}
