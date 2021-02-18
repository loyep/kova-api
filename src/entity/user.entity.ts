import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm"
import { Post } from "./post.entity"

export interface UserMeta {
  cover: string
  color: string
  background: string
}

export const defaultMeta: UserMeta = {
  cover: "",
  background: "",
  color: "",
}

export enum UserStatus {
  inactivated = "inactivated",
  active = "active",
  frozen = "frozen",
}

@Entity({
  name: "users",
  orderBy: {
    updatedAt: "DESC",
  },
})
export class User {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number

  @Column("varchar", { length: 100 })
  name: string

  @Column("varchar", { length: 50 })
  email: string

  @Column("varchar", { name: "display_name", nullable: true, default: null })
  displayName: string

  @Column("varchar", { nullable: true, default: null })
  url: string

  @Column("simple-json", { default: null, select: true })
  meta: UserMeta

  @Column("varchar", { nullable: true, default: null })
  avatar: string

  @Column("varchar", { nullable: true, default: null })
  image: string

  @Column("varchar", { nullable: true, default: null, select: false })
  cover: string

  @Column("varchar", { default: UserStatus.inactivated })
  status: string

  @Column("varchar", { nullable: true, default: null })
  bio: string

  @Column("varchar", {
    nullable: true,
    default: null,
    length: 20,
    select: false,
  })
  mobile: string

  @Column("varchar", { select: false })
  password: string

  @Column("datetime", { name: "logged_at", nullable: true, select: false, default: null })
  loggedAt: Date

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Promise<Post[]>

  // @ManyToMany(() => Post, (post: Post) => post.likedUsers)
  // likePosts: Promise<Post[]>;
}
