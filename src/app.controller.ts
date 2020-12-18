import { APIPrefix } from '@/constants/constants';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}
}
