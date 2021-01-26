import { CacheService } from "@/cache"
import { LoggerService } from "@/common/logger.service"
import { HttpService, Injectable } from "@nestjs/common"
import { config } from "rxjs"

interface WechatOption {
  appid: string
  secret: string
  accessTokenTtl: number
}

@Injectable()
export class WechatService {
  options: WechatOption

  constructor(
    private readonly http: HttpService,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {
    this.options = {
      appid: "wxa1a395c10ee20dee",
      secret: "acc9c6f5c4702a050b83cfb5c5864489",
      accessTokenTtl: 7000,
    }
  }

  // async urlschemeGenerate(postData: { jump_wxa?: any }, accessToken = "") {
  //   if (!accessToken) {
  //     accessToken = await this.getAccessToken()
  //   }
  //   const url = `https://api.weixin.qq.com/wxa/generatescheme?access_token=${accessToken}`
  //   const { data } = await this.http
  //     .post(url, {
  //       is_expire: true,
  //       expire_time: Date.now() / 1000 + 60,
  //     })
  //     .toPromise()
  //   return data
  // }

  // async getAccessToken() {
  //   let accessToken: string = await this.cacheService.get("accessToken")
  //   if (!accessToken) {
  //     const params = {
  //       grant_type: "client_credential",
  //       appid: this.options.appid,
  //       secret: this.options.secret,
  //     }
  //     const { data } = await this.http.get("https://api.weixin.qq.com/cgi-bin/token", { params }).toPromise()
  //     accessToken = data.access_token
  //     await this.cacheService.set("accessToken", accessToken, this.options.accessTokenTtl)
  //   }
  //   return accessToken
  // }
}
