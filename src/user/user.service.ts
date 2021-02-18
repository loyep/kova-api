import { LoggerService } from "@/common/logger.service"
import { User, UserStatus } from "@/entity/user.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindConditions, Like, ObjectLiteral, Repository, Not } from "typeorm"

import { compareSync } from "bcrypt"
import { ListResult } from "@/entity/listresult.entity"
import { paginate } from "@/common"
import { EntityFieldsNames } from "typeorm/common/EntityFieldsNames"

type OrderType = {
  [P in EntityFieldsNames<User>]?: "ASC" | "DESC" | 1 | -1
}

type WhereType = FindConditions<User>[] | FindConditions<User> | ObjectLiteral | string

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly logger: LoggerService,
  ) {
    //
  }

  async list({ page, pageSize = 20 }: { page: number; pageSize?: number }): Promise<ListResult<User>> {
    const [list, count] = await this.repo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
    return {
      list,
      meta: {
        count,
        page,
        pageSize,
        totalPage: Math.ceil(count / pageSize),
      },
    }
  }

  paginate(page: number, { s, status = UserStatus.active }: { s?: string; status?: UserStatus } = {}) {
    return paginate<User>(
      this.repo,
      { page, pageSize: 20 },
      {
        where: {
          status,
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async index(
    page: number,
    pageSize: number,
    { s, where = {} }: { s?: string; where?: WhereType } = {},
    select?: (keyof User)[],
  ) {
    const order: OrderType = {
      // updatedAt: "DESC",
      id: "DESC",
    }

    return await paginate<User>(
      this.repo,
      { page, pageSize },
      {
        select,
        where: {
          ...(where || ({} as any)),
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
        order,
      },
    )
  }

  async all(): Promise<User[]> {
    const users: User[] = await this.repo.find({
      order: {
        createdAt: "DESC",
      },
    })
    return users
  }

  verifyPassword(password: string, oldPwd: string) {
    if (!password || !oldPwd) {
      return false
    }
    return compareSync(password, oldPwd)
  }

  async getUser(id: number): Promise<User> {
    this.logger.log({
      data: {
        thecodeline: "this.redisService.getUser " + id,
      },
    })

    let user: User = null // = await this.redisService.getUser(id);

    this.logger.log({
      data: {
        thecodeline: "user null ?" + !user,
      },
    })

    if (!user) {
      this.logger.log({
        data: {
          thecodeline: "this.userRepository.findOne",
        },
      })

      try {
        user = await this.repo.findOne({
          select: ["id", "status", "name", "avatar", "displayName", "email"],
          where: {
            id,
          },
        })
      } catch (err) {
        this.logger.log({
          message: [err.message, err.stack].join("\n"),
        })
        throw err
      }

      this.logger.log({
        data: {
          thecodeline: "this.redisService.setUser",
        },
      })
      // await this.redisService.setUser(user);
    }

    this.logger.log({
      data: {
        thecodeline: "===> user.service.getUser done",
      },
    })

    return user
  }

  async findUser(where, select: (keyof User)[] = []) {
    const user = await this.repo.findOne({
      select,
      where,
    })
    return user
  }

  async findByName(name: string, status: UserStatus = UserStatus.active) {
    const user = await this.repo.findOneOrFail({
      where: {
        name,
        status,
      },
      // relations: ['category', 'user', 'content'],
    })
    user.url = user.url || ""
    return user
  }

  findById(id: number | string) {
    return this.repo.findOneOrFail(id)
  }

  async update(userId: number | string, newUser: User) {
    const existedUserCount = await this.repo
      .createQueryBuilder()
      .where("id != :id", { id: userId })
      .andWhere("(name = :name or email = :email)", { name: newUser.name, email: newUser.email })
      .getCount()

    this.logger.log(existedUserCount)
    if (existedUserCount > 0) {
      throw "别名已被占用"
    }
    await this.repo.update(userId, newUser)
    return await this.repo.findOneOrFail(userId)
  }
}
