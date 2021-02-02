import { Controller, Get, Req, Res } from "@nestjs/common"
import { LoggerService } from "@/common/logger.service"
import { WechatService } from "./wechat.service"
import { createHash } from "crypto"

const encrypt = (algorithm: string, content: string) => {
  const hash = createHash(algorithm)
  hash.update(content)
  return hash.digest("hex")
}
const sha1 = (content: string) => encrypt("sha1", content)

@Controller()
export class WechatController {
  constructor(private readonly wechatService: WechatService, private readonly logger: LoggerService) {}

  @Get("/wechat")
  async checkSignature(@Req() req: any, @Res() res: any) {
    try {
      this.logger.info({
        data: req.query,
      })
      const { signature, timestamp, nonce } = req.query || {}
      const token = "jingyin"
      const str = [nonce, timestamp, token].sort().join("")
      this.logger.info({
        data: {
          str,
        },
      })
      const sign = sha1(str)
      this.logger.info({
        data: {
          sign,
        },
      })
      res.send(sign === signature)
    } catch (error) {
      console.log(error)
      res.send(false)
    }
  }
}
