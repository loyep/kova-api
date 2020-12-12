import { APIPrefix } from '@/constants/constants';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get(`${APIPrefix}/`)
  root() {
    return `<h3>Welcome to Kova API</h3>
    <br/>Checkout <a href="docs">API Docs</a>
    <br/><code>Version: ${this.config.getVersion()}</code>`;
  }
}
