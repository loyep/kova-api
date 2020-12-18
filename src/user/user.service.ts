import { LoggerService } from '@/common/logger.service';
import { User, UserStatus } from '@/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync } from 'bcrypt';
import { ListResult } from '@/entity/listresult.entity';

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
    });
    return {
      list,
      meta: {
        count,
        page,
        pageSize,
        totalPage: Math.ceil(count / pageSize),
      },
    };
  }

  async all(): Promise<User[]> {
    const users: User[] = await this.repo.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return users;
  }

  verifyPassword(password: string, oldPwd: string) {
    if (!password || !oldPwd) {
      return false;
    }
    return compareSync(password, oldPwd);
  }

  async getUser(id: number): Promise<User> {
    this.logger.info({
      data: {
        thecodeline: 'this.redisService.getUser ' + id,
      },
    });

    let user: User = null; // = await this.redisService.getUser(id);

    this.logger.info({
      data: {
        thecodeline: 'user null ?' + !user,
      },
    });

    if (!user) {
      this.logger.info({
        data: {
          thecodeline: 'this.userRepository.findOne',
        },
      });

      try {
        user = await this.repo.findOne({
          select: ['id', 'status', 'name', 'avatar', 'displayName', 'email'],
          where: {
            id,
          },
        });
      } catch (err) {
        this.logger.info({
          message: [err.message, err.stack].join('\n'),
        });
        throw err;
      }

      this.logger.info({
        data: {
          thecodeline: 'this.redisService.setUser',
        },
      });
      // await this.redisService.setUser(user);
    }

    this.logger.info({
      data: {
        thecodeline: '===> user.service.getUser done',
      },
    });

    return user;
  }

  async findUser(where, select) {
    const user = await this.repo.findOne({
      select,
      where,
    });
    return user;
  }

  async findByName(name: string, status: UserStatus = UserStatus.active) {
    const user = await this.repo.findOneOrFail({
      where: {
        name,
        status,
      },
      // relations: ['category', 'user', 'content'],
    });
    user.url = user.url || '';
    return user;
  }
}
