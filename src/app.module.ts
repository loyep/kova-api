import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common"
import { TerminusModule } from "@nestjs/terminus"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "./config"
import { CommonModule } from "./common"
import { UserModule } from "./user"
import { WechatModule } from "./wechat"
import { UserMiddleware } from "./core/middleware/user.middleware"
import { ContentModule } from "./content"
import { CacheModule } from "./cache"
import { AppController } from "./app.controller"
import { HealthController } from "./health.controller"
// import { WinstonModule } from "nest-winston"
// import * as winston from "winston"
// import DailyRotateFile from "winston-daily-rotate-file"
// const format = winston.format

@Module({
  imports: [
    ConfigModule,
    // WinstonModule.forRoot({
    //   exitOnError: false,
    //   format: format.combine(
    //     format.colorize(),
    //     format.timestamp({
    //       format: "HH:mm:ss YY/MM/DD",
    //     }),
    //     format.label({
    //       label: "测试",
    //     }),

    //     format.splat(),
    //     format.printf((info) => {
    //       return `${info.timestamp} ${info.level}: [${info.label}]${info.message}`
    //     }),
    //   ),
    //   transports: [
    //     new winston.transports.Console({
    //       level: "info",
    //     }),
    //     new DailyRotateFile({
    //       filename: "logs/application-%DATE%.log",
    //       datePattern: "YYYY-MM-DD-HH",
    //       zippedArchive: true,
    //       maxSize: "20m",
    //       maxFiles: "14d",
    //     }),
    //   ],
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        // typeorm bug, https://github.com/nestjs/nest/issues/1119
        // 将 type 定义为 type: 'mysql' | 'mariadb'; 解决此issue
        return configService.db
      },
      inject: [ConfigService],
    }),
    CommonModule,
    ContentModule,
    CacheModule,
    UserModule,
    WechatModule,
    TerminusModule,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const middlewares = [
      // IpMiddleware,
      // CookieParserMiddleware,
      // RateLimitMiddleware,
      // CorsMiddleware,
      // CSRFMiddleware,
      // SessionMiddleware,
      UserMiddleware,
    ]
    consumer.apply(...middlewares).forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
