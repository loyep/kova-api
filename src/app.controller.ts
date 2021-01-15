// import { APIPrefix } from "@/constants/constants"
import { Controller, Get, Injectable } from "@nestjs/common"
// import SnowFlake from "./common/snowflake"
import { CacheService } from "./cache"
import axios from "axios"
import { LoggerService } from "./common/logger.service"

@Controller()
@Injectable()
export class AppController {
  public client: any

  constructor(private readonly cacheService: CacheService, private readonly logger: LoggerService) {}

  async getClient() {
    this.client = this.cacheService.get("test")
  }

  @Get("/")
  async testFun() {
    // const idWorker = new SnowFlake(1n, 1n)
    // const tempIds = []
    // const now = new Date()
    // const id = idWorker.nextId("string", 10)
    // // console.log(id);
    // tempIds.push(id)
    // console.log(new Date().getTime() - now.getTime())
    // console.log(tempIds.length)
    // // const end = +new Date();
    // console.log(tempIds)
    // console.timeEnd("id")
    // return { data: tempIds.length }
    const accessToken = await this.getAccessToken()
    this.logger.info({
      message: `accessToken:${accessToken}`,
    })
    const urlscheme = await this.urlschemeGenerate(accessToken)
    return urlscheme
  }

  async getAccessToken() {
    let accessToken: string = await this.cacheService.get("accessToken")
    this.logger.info({
      message: `accessToken2:${accessToken}`,
    })
    if (accessToken) {
      return accessToken
    }

    const res = await axios({
      method: "GET",
      url: "https://api.weixin.qq.com/cgi-bin/token",
      params: {
        grant_type: "client_credential",
        appid: "wxa1a395c10ee20dee",
        secret: "acc9c6f5c4702a050b83cfb5c5864489",
      },
    })
    const { data } = res
    this.logger.info({
      message: `token-res:${JSON.stringify(data)}`,
    })
    accessToken = data.access_token
    this.logger.info({
      message: `access_token3:${accessToken}`,
    })
    await this.cacheService.set("accessToken", accessToken, {
      ttl: 7000,
    })
    const token2 = await this.cacheService.get("accessToken")
    this.logger.info({
      message: `token2:${token2}`,
    })
    return accessToken
  }

  async urlschemeGenerate(accessToken: string) {
    const postData = {}
    const res = await axios({
      method: "POST",
      url: `https://api.weixin.qq.com/wxa/generatescheme?access_token=${accessToken}`,
      data: postData,
      // data: {
      // access_token: accessToken,
      // jump_wxa: {
      //   path: "/",
      //   query: "?",
      // },
      // },
    })
    const { data } = res
    return data
  }
}
