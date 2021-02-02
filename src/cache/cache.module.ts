import { CacheModule as NestCacheModule, Global, Module } from "@nestjs/common"
import { CacheConfigService } from "./cache-config.service"
import { CacheService } from "./cache.service"
import * as redisStore from "cache-manager-redis-store"
import { RedisModule } from "nestjs-redis"
import { CommonModule } from "@/common"

@Global()
@Module({
  imports: [
    // NestCacheModule.register({
    //   store: redisStore,
    //   host: "140.143.245.194",
    //   port: 6379,
    //   password: "heli921227",
    // }),
    RedisModule.register({
      host: "140.143.245.194",
      port: 6379,
      password: "heli921227",
      db: 0,
    }),
    CommonModule,
  ],
  providers: [CacheConfigService, CacheService],
  exports: [CacheService],
})
export class CacheModule {}
