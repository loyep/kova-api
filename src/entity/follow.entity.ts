import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "follows" })
export class Follow {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number

  @Column("varchar", { nullable: true, default: null })
  type: string

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date
}
