import { APIPrefix } from '@/constants/constants';
import { Controller, Get } from '@nestjs/common';
import SnowFlake from './common/snowflake';
import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get('/')
  testFun() {
    const idWorker = new SnowFlake(1n, 1n);
    const tempIds = [];
    const now = new Date();
    const id = idWorker.nextId('string', 10);
    // console.log(id);
    tempIds.push(id);
    console.log(new Date().getTime() - now.getTime());
    console.log(tempIds.length);
    // const end = +new Date();
    console.log(tempIds);
    console.timeEnd('id');
    return { data: tempIds.length };
  }
}
