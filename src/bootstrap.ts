import { ConfigService } from "@/config/config.service"
import { LoggerService } from "@/common/logger.service"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { HttpExceptionFilter, LoggingInterceptor, sessionPlugin, TransformInterceptor } from "@/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
// import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston"

export default async function bootstrap(app: INestApplication, listening = true) {
  const configService: ConfigService = app.get(ConfigService)
  const loggerService: LoggerService = app.get(LoggerService)

  app.setGlobalPrefix("/api")
  // const winston = app.get(WINSTON_MODULE_NEST_PROVIDER)
  // app.useLogger(winston)

  loggerService.log({
    message: "Starting Nest application...",
    data: {
      NODE_ENV: process.env.NODE_ENV,
      port: configService.server.port,
    },
  })

  // Session
  app.use(sessionPlugin())

  // Interceptors
  app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor())

  // Filters
  app.useGlobalFilters(new HttpExceptionFilter())

  // Pipes
  app.useGlobalPipes(new ValidationPipe())

  // Cors
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    maxAge: 3600,
  })

  const options = new DocumentBuilder()
    .setTitle("Sumo API Docs")
    .setDescription("Sumo API for Ngx Starter Kit")
    .setExternalDoc("Github Repo", "https://github.com/xmlking/ngx-starter-kit/tree/master/apps/api")
    .setVersion("1.0.0")
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {},
  })

  if (listening) {
    await app.listen(configService.server.port)
    loggerService.log({
      message: "Nest application successfully started",
    })
  }
}
