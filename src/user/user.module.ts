import { CommonModule } from "@/common/common.module"
import { Article, ArticleService } from "@/content"
import { User } from "@/entity/user.entity"
import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "./auth.controller"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Article]), CommonModule],
  providers: [UserService, ArticleService],
  controllers: [UserController, AuthController],
  exports: [UserService],
})
export class UserModule {}
