import * as util from 'util';
import {
  Controller,
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
import { TopicService } from './topic.service';

@Controller()
export class TopicController {
  constructor(
    private readonly configService: ConfigService,
    private readonly topicService: TopicService,
  ) {}

  async all() {
    return await this.topicService.all();
  }
}
