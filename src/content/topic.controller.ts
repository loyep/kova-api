import { Controller, Get, Param, Query } from '@nestjs/common';
import { TopicNotFound, TopicService } from './topic.service';
import { AdminAPIPrefix, APIPrefix } from '@/constants/constants';
import { Topic } from '@/entity/topic.entity';
import { ApiOperation } from '@nestjs/swagger';
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe';

@Controller()
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: '专题列表', tags: ['topic'] })
  @Get(`${APIPrefix}/topics`)
  async list(@Query('s') s: string, @Query('page', ParsePagePipe) page: number) {
    return await this.topicService.paginate(page, { s });
  }

  @ApiOperation({ summary: '根据slug展示专题', tags: ['topic'] })
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

  @ApiOperation({ summary: '根据id展示专题', tags: ['topic'] })
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
