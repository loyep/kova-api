import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

class UserScoreDef {
  readonly CreateArticle: number = 5;
}

export const UserScore = new UserScoreDef();

export enum UserRole {
  Normal = 1, // 普通用户
  Editor = 2, // 网站编辑
  Admin = 3, // 管理员
  SuperAdmin = 4, // 超级管理员
}

export enum UserStatus {
  InActive = 1, // 未激活
  Actived = 2, // 已激活
  Frozen = 3, // 已冻结
}

export enum UserSex {
  Male = 0, // 男
  Female = 1, // 女
  Unknown = 2, // 未知
}

export class Follower {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly avatarURL: string,
    public readonly date: Date,
  ) {}
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at' })
  updatedAt: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;

  @Column('datetime', { name: 'activated_at', nullable: true, default: null })
  activatedAt: Date; // 账号激活时间

  @Column('varchar', { length: 100 })
  username: string;

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar', { length: 50, nullable: true, default: null })
  phone: string;

  @Exclude()
  @Column('varchar', { length: 100 })
  pass: string;

  @Column('int', { name: 'value', default: 0 })
  value: number; // 米粒值

  @Column('int', { name: 'article_count', default: 0 })
  articleCount: number;

  @Column('int', { name: 'article_view_count', default: 0 })
  articleViewCount: number; // 文章被阅读的次数

  @Column('int', { name: 'comment_count', default: 0 })
  commentCount: number;

  @Column('int', { name: 'follow_count', default: 0 })
  followCount: number; // 关注了多少人

  @Column('int', { name: 'follower_count', default: 0 })
  followerCount: number; // 被多少人关注

  @Column('int', { name: 'follow_tag_count', default: 0 })
  followTagCount: number; // 关注了多少个标签

  @Column('int', { name: 'liked_count', default: 0 })
  likedCount: number; // 获得多少个赞

  @Column('int', { name: 'u_like_count', default: 0 })
  uLikeCount: number; // 用户一共点了多少个赞

  @Column('int', { name: 'u_article_like_count', default: 0 })
  uArticleLikeCount: number; // 用户对文章点了多少个赞

  @Column('int', { name: 'u_bp_like_count', default: 0 })
  uBoilingPointLikeCount: number; // 用户对沸点点了多少个赞

  @Column('int', { name: 'collection_count', default: 0 })
  collectionCount: number; // 收藏集的个数

  @Column('int')
  role: UserRole; // 角色

  @Column('int')
  status: UserStatus; // 用户状态

  @Column('varchar', { name: 'avatar_url', length: 500 })
  avatarURL: string; // 头像

  @Column('tinyint')
  sex: UserSex;

  @Column('varchar', { name: 'job', length: 100 })
  job: string;

  @Column('varchar', { name: 'company', length: 100 })
  company: string;

  @Column('varchar', { length: 200 })
  bio: string; // 个人介绍
}
