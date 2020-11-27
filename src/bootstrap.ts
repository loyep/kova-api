import { ConfigService } from './config/config.service';
import { LoggerService } from './common/logger.service';
import * as session from 'express-session';
const FileStore = require('session-file-store')(session);

export default async function bootstrap(app, listening = true) {
  const configService: ConfigService = app.get(ConfigService);
  const loggerService: LoggerService = app.get(LoggerService);

  loggerService.info({
    message: 'Starting Nest application...',
    data: {
      NODE_ENV: process.env.NODE_ENV,
      port: configService.server.port,
    },
  });

  const fileStore = new FileStore({
    path: './storage/sessions',
  });
  app.use(
    session({
      secret: 'kova',
      name: 'kova_session',
      cookie: { maxAge: 60000 },
      resave: false,
      rolling: true,
      saveUninitialized: true,
      store: fileStore,
    }),
  );

  if (listening) {
    await app.listen(configService.server.port);
    loggerService.info({
      message: 'Nest application successfully started',
    });
  }
}
