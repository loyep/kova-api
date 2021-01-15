// import { APIPrefix } from "@/constants/constants"
import { Controller, Get, Injectable } from "@nestjs/common"
// import SnowFlake from "./common/snowflake"
import { CacheService } from "./cache"
import axios from "axios"
import { LoggerService } from "./common/logger.service"
import { WechatService } from "./wechat/wechat.service"

@Controller()
@Injectable()
export class AppController {
  public client: any

  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
    private readonly wechat: WechatService,
  ) {}

  @Get("/")
  async index() {
    const accessToken = await this.wechat.getAccessToken()
    this.logger.info({
      message: `accessToken:${accessToken}`,
    })
    const urlscheme = await this.wechat.urlschemeGenerate({}, accessToken)
    return urlscheme
  }
}
