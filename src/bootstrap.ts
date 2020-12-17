import { ConfigService } from '@/config/config.service';
import { LoggerService } from '@/common/logger.service';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter, LoggingInterceptor, sessionPlugin } from '@/core';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { Reflector } from '@nestjs/core';

export default async function bootstrap(app: INestApplication, listening = true) {
  const configService: ConfigService = app.get(ConfigService);
  const loggerService: LoggerService = app.get(LoggerService);

  loggerService.info({
    message: 'Starting Nest application...',
    data: {
      NODE_ENV: process.env.NODE_ENV,
      port: configService.server.port,
    },
  });

  // Session
  app.use(sessionPlugin());

  // Interceptors
  app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());

  // Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    maxAge: 3600,
  });

  if (listening) {
    await app.listen(configService.server.port);
    loggerService.info({
      message: 'Nest application successfully started',
    });
  }
}
