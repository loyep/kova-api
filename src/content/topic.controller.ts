import { Controller, Get, Param, Res } from '@nestjs/common';
import { TopicNotFound, TopicService } from './topic.service';
import { AdminAPIPrefix, APIPrefix } from '@/constants/constants';
import { Topic } from '@/entity/topic.entity';
import { ErrorCode } from '@/constants/error';

@Controller()
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get(`${APIPrefix}/topics`)
  async getAll() {
    const topics: Topic[] = await this.topicService.all();
    return topics;
  }

  @Get(`${APIPrefix}/topics/:slug`)
  async showBySlug(@Param('slug') slug: string) {
    try {
      const topic = await this.topicService.findBySlug(slug);
      if (!topic) {
        throw TopicNotFound;
      }
      return topic;
    } catch (error) {
      throw TopicNotFound;
    }
  }

  @Get(`${AdminAPIPrefix}/topics/:id`)
  async show(@Param('id') id: number) {
    try {
      const topic = await this.topicService.findById(id);
      return topic;
    } catch (error) {
      throw TopicNotFound;
    }
  }
}
