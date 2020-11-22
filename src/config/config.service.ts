import * as _ from 'lodash';
import defaultJSON from './cfg.default';
import developmentJSON from './cfg.development';
import testJSON from './cfg.test';
import productionJSON from './cfg.production';
import { ServerConfig } from './type/ServerConfig';
import DBConfig from './type/DBConfig';

export class ConfigService {
  readonly DEVELOPMENT = 'development';
  readonly TEST = 'test';
  readonly PRODUCTION = 'production';

  readonly env: string;
  readonly server: ServerConfig;
  readonly db: DBConfig;

  constructor() {
    const envConfigMap = {
      development: developmentJSON,
      test: testJSON,
      production: productionJSON,
    };
    console.log(envConfigMap);
    console.log(process.env.NODE_ENV);
    if (envConfigMap[process.env.NODE_ENV]) {
      _.merge(defaultJSON, envConfigMap[process.env.NODE_ENV]);
      this.env = process.env.NODE_ENV;
    } else {
      this.env = this.DEVELOPMENT;
    }
    this.db = new DBConfig(defaultJSON.db);
    if (this.env !== this.DEVELOPMENT && this.db.synchronize) {
      process.exit(-1);
    }
    this.server = new ServerConfig(defaultJSON.server);
  }
}
