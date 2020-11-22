import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';

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
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}
}
