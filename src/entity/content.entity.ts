import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm"
import { Post } from "./post.entity"

@Entity({ name: "contents" })
export class Content {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number

  @Column("mediumtext", { nullable: true, default: null })
  markdown: string

  @Column("mediumtext", { nullable: true, default: null })
  html: string

  @Column("mediumtext", { nullable: true, default: null })
  content: string

  @Column("varchar", { nullable: true, default: null })
  type: string

  @OneToOne(() => Post, (post: Post) => post.content)
  @JoinColumn({ name: "post_id" })
  post?: Post

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date
}
