import defaultJSON from './cfg.default';
import { ServerConfig } from './type/ServerConfig';
export class ConfigService {
  readonly DEVELOPMENT = 'development';
  readonly TEST = 'test';
  readonly PRODUCTION = 'production';

  readonly env: string;
  readonly server: ServerConfig;

  constructor() {
    this.server = new ServerConfig(defaultJSON.server);
  }
}
