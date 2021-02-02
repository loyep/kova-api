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
    const { signature, timestamp, nonce } = req.query || {}
    const token = "jingyin"
    const sign = sha1([nonce, timestamp, token].join(""))
    this.logger.info({
      data: req.query,
    })
    return res.send(sign === signature)
  }
}
