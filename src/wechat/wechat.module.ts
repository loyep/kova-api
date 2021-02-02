import { CommonModule } from "@/common"
import { LoggerService } from "@/common/logger.service"
import { HttpModule, Module } from "@nestjs/common"
import { WechatController } from "./wechat.controller"
import { WechatService } from "./wechat.service"

@Module({
  imports: [HttpModule.register({ timeout: 5000 }), LoggerService, CommonModule],
  controllers: [WechatController],
  providers: [WechatService],
  exports: [WechatService],
})
export class WechatModule {}
