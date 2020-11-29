import { LoggerService } from '@/common/logger.service';
import { ConfigService } from '@/config/config.service';
import { User } from '@/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  FindOptionsWhereCondition,
  Repository,
} from 'typeorm';
import { hashSync, compareSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: LoggerService,
  ) {
    //
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
        thecodeline: 'this.redisService.getUser nvnsiwpwo ' + id,
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
          thecodeline: 'this.userRepository.findOne irueghahs',
        },
      });

      // TODO: users 表增加 level 字段， 然后查出 level
      try {
        user = await this.userRepository.findOne({
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
          thecodeline: 'this.redisService.setUser m97hejiriw',
        },
      });
      // await this.redisService.setUser(user);
    }

    this.logger.info({
      data: {
        thecodeline: '===> user.service.getUser done irir89',
      },
    });

    return user;
  }

  async findUser(where, select) {
    const user = await this.userRepository.findOne({
      select,
      where,
    });
    return user;
  }
}
