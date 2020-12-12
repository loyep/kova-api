import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from './config';
import { CommonModule } from './common';
import { UserModule } from './user';
import { UserMiddleware } from './core/middleware/user.middleware';
import { ContentModule } from './content';
import { CacheModule } from './cache';
import { AppController } from './app.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        // typeorm bug, https://github.com/nestjs/nest/issues/1119
        // 将 type 定义为 type: 'mysql' | 'mariadb'; 解决此issue
        return configService.db;
      },
      inject: [ConfigService],
    }),
    CommonModule,
    ContentModule,
    CacheModule,
    UserModule,
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
    ];
    consumer
      .apply(...middlewares)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
