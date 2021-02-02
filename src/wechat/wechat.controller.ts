import { Controller, Get, Post, Req, Res } from "@nestjs/common"
import { LoggerService } from "@/common/logger.service"
import { WechatService, WechatMsgType } from "./wechat.service"
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
      const { signature, timestamp, nonce, echostr } = req.query || {}
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
      res.send(sign === signature ? echostr : "")
    } catch (error) {
      console.log(error)
      res.send("")
    }
  }

  @Post("/wechat")
  async handleMessage(@Req() req: any, @Res() res: any) {
    try {
      console.log(req.body)
      const { FromUserName, MsgType, Event } = req.body || {}
      switch (MsgType as WechatMsgType) {
        case "event": {
          this.handleEventMessage({ FromUserName, Event })
          break
        }
        case "miniprogrampage": {
          this.handleMiniProgrampageMessage({ FromUserName })
          break
        }
        case "image": {
          this.handleImageMessage({ FromUserName })
          break
        }
        case "link": {
          this.handleLinkMessage({ FromUserName })
          break
        }
        case "text": {
          this.handleTextMessage({ FromUserName })
          break
        }
      }
      res.send("success")
    } catch (error) {
      console.log(error)
      res.send("")
    }
  }

  handleTextMessage(message: { FromUserName: string }) {
    console.log(message)
    this.wechatService.sendCustomerServiceMessage({
      touser: message.FromUserName,
      msgtype: "text",
      text: {
        content: "666",
      },
    })
  }

  handleImageMessage(message: { FromUserName: string }) {
    console.log(message)
    this.wechatService.sendCustomerServiceMessage({
      touser: message.FromUserName,
      msgtype: "text",
      text: {
        content: "666",
      },
    })
  }

  handleLinkMessage(message: { FromUserName: string }) {
    console.log(message)
    this.wechatService.sendCustomerServiceMessage({
      touser: message.FromUserName,
      msgtype: "text",
      text: {
        content: "666",
      },
    })
  }

  handleEventMessage(message: { FromUserName: string; Event: string }) {
    console.log(message)
    if (message.Event === "user_enter_tempsession") {
      this.wechatService.sendCustomerServiceMessage({
        msgtype: "text",
        touser: message.FromUserName,
        text: {
          content: `你好`,
        },
      })
    }
  }

  handleMiniProgrampageMessage(message: { FromUserName: string }) {
    console.log(message)
    this.wechatService.sendCustomerServiceMessage({
      touser: message.FromUserName,
      msgtype: "text",
      text: {
        content: "666",
      },
    })
  }
}
