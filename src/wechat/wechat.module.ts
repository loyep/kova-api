import { CommonModule } from "@/common"
import { LoggerService } from "@/common/logger.service"
import { HttpModule, Module } from "@nestjs/common"
import { WechatService } from "./wechat.service"

@Module({
  imports: [HttpModule.register({ timeout: 5000 }), LoggerService, CommonModule],
  providers: [WechatService],
  exports: [WechatService],
})
export class WechatModule {}
