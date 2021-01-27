// import { APIPrefix } from "@/constants/constants"
import { Controller, Get, Injectable, Req } from "@nestjs/common"
// import SnowFlake from "./common/snowflake"
import { CacheService } from "./cache"
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
  async index(@Req() req) {
    // const value = await this.cacheService.remember("ewee", () => "222", 3000)
    // const exists = await this.cacheService.has("ewee")
    // try {
    //   await this.cacheService.add("ewee", "22233")
    // } catch (error) {
    //   console.log(error)
    // }
    const res2 = await this.cacheService.remember("222", 3333)
    await this.cacheService.put("e2wee", 3333, 0)
    await this.cacheService.forever("222", 3333)
    const value = await this.cacheService.get("ewee")
    req.session["222"] = 666
    req.session["22222"] = 666
    return { value, res2 }
    // const accessToken = await this.wechat.getAccessToken()
    // this.logger.info({
    //   message: `accessToken:${accessToken}`,
    // })
    // // const urlscheme = await this.wechat.urlschemeGenerate({}, accessToken)
    // // return urlscheme
    // const key = await this.cacheService.remember(
    //   "test2",
    //   async () => {
    //     return await this.wechat.getAccessToken()
    //   },
    //   { ttl: 600 },
    // )
    // return { key }
  }
}
