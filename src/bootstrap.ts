import { ConfigService } from './config/config.service';
import { MyLoggerService } from './common/logger.service';

export default async function bootstrap(app, listening = true) {
  const configService: ConfigService = app.get(ConfigService);
  const myLoggerService: MyLoggerService = app.get(MyLoggerService);

  myLoggerService.info({
    message: 'Starting Nest application...',
    data: {
      NODE_ENV: process.env.NODE_ENV,
      port: configService.server.port,
    },
  });
  if (listening) {
    await app.listen(configService.server.port);
    myLoggerService.info({
      message: 'Nest application successfully started',
    });
  }
}
