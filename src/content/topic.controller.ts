import * as util from 'util';
import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Get,
  Query,
  Param,
  Res,
  Delete,
} from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entity/user.entity';
import { Post as PostEntity, PostStatus } from '@/entity/post.entity';
import { Topic } from '@/entity/topic.entity';
import { TopicService } from './topic.service';

@Controller()
export class TopicController {
  constructor(
    private readonly configService: ConfigService,
    private readonly topicService: TopicService,
  ) {}

  @Get('/p/:slug')
  async getPost(@Param('slug') slug: string, @Res() res) {
    return;
  }

  async all() {
    return await this.topicService.all();
  }
}
