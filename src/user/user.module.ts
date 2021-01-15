import { CommonModule } from "@/common/common.module"
import { Post, PostService } from "@/content"
import { User } from "@/entity/user.entity"
import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "./auth.controller"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), CommonModule],
  providers: [UserService, PostService],
  controllers: [UserController, AuthController],
  exports: [UserService],
})
export class UserModule {}
