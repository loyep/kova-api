import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { TopicService } from './topic.service';
import { AdminAPIPrefix, APIPrefix } from '@/constants/constants';
import { Topic } from '@/entity/topic.entity';
import { ErrorCode } from '@/constants/error';

@Controller()
export class TopicController {
  constructor(
    private readonly configService: ConfigService,
    private readonly topicService: TopicService,
  ) {}

  @Get(`${APIPrefix}/tags`)
  async getAll() {
    const topics: Topic[] = await this.topicService.all();
    return topics;
  }

  @Get(`${APIPrefix}/tags/:slug`)
  async showBySlug(@Param('slug') slug: string, @Res() res) {
    const topic = await this.topicService.findBySlug(slug);

    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      data: topic,
    });
  }

  @Get(`${AdminAPIPrefix}/tags/:id`)
  async show(@Param('id') id: number, @Res() res) {
    const topic = await this.topicService.findById(id);

    return res.json({
      code: ErrorCode.SUCCESS.CODE,
      data: topic,
    });
  }
}
