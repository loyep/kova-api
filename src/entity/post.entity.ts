import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm"
import { Category } from "./category.entity"
import { User } from "./user.entity"
import { Tag } from "./tag.entity"
import { Content } from "./content.entity"
import { IsNotEmpty, IsString } from "class-validator"

export interface PostMeta {
  cover: string
  color: string
  background: string
}

export function defaultMeta(): PostMeta {
  return {
    cover: "",
    background: "",
    color: "",
  }
}

export enum PostStatus {
  published = "published",
  private = "private",
  password = "password",
  draft = "draft",
}

export enum PostCommentType {
  allow = "allow",
  refuse = "refuse",
  commented = "commented",
  logged = "logged",
}

export enum PostType {
  default = "default",
  // refuse = 'refuse',
  // commented = 'commented',
  // logged = 'logged',
}

@Entity({
  name: "posts",
  orderBy: {
    publishedAt: "DESC",
    id: "DESC",
  },
})
export class Post {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number

  @IsNotEmpty({ message: "文章标题？" })
  @IsString({ message: "字符串？" })
  @Column("varchar", { nullable: true, default: null })
  title: string

  @Column("varchar", { default: PostStatus.published })
  status: string

  @Column("varchar", { nullable: true, default: null, unique: true })
  slug: string

  @Column("varchar", { nullable: true, default: null })
  image: string | null

  @Column("varchar", { nullable: true, default: null })
  excerpt: string | null

  @Column("simple-json", { default: null, select: true })
  meta: PostMeta

  @OneToOne(() => Content, (content: Content) => content.post)
  content: Content | null

  @Column("bigint", {
    name: "content_id",
    nullable: true,
    default: 0,
    unsigned: true,
  })
  contentId: number

  @Column("tinytext", { nullable: true, default: null })
  cover: string | null

  @Column("varchar", { default: PostType.default })
  type: string

  @Column("int", { name: "views_count", unsigned: true, default: 0 })
  viewsCount: number

  @Column("int", { name: "likes_count", unsigned: true, default: 0 })
  likesCount: number

  @Column("int", { name: "comments_count", unsigned: true, default: 0 })
  @Index()
  commentsCount: number

  @Column("varchar", {
    name: "comment_type",
    default: PostCommentType.allow,
  })
  commentType: string

  @Column("varchar", { nullable: true, default: null, select: false })
  password: string | null

  @Column("datetime", { name: "published_at", nullable: true, default: null })
  publishedAt: Date | null

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date

  @ManyToOne(() => Category, (category: Category) => category.posts, {
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "category_id" })
  category: Category

  @Column("bigint", {
    name: "category_id",
    nullable: true,
    default: null,
    select: false,
  })
  categoryId: number

  @ManyToOne(() => User, (user: User) => user.posts, {
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "user_id" })
  user: User

  @Column("bigint", {
    name: "user_id",
    nullable: true,
    default: null,
    select: false,
  })
  userId: number

  prev: Post | null

  next: Post | null

  related: Post[]

  @ManyToMany(() => Tag, (tag: Tag) => tag.posts)
  @JoinTable({
    name: "post_tags",
    joinColumn: { name: "post_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags: Promise<Tag[]>

  // @ManyToMany(() => User, (user: User) => user.likePosts)
  // @JoinTable({ name: 'likes' })
  // likedUsers: Promise<User[]>;
}
