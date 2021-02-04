import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
// import { LogLevel } from "@nestjs/common"
import { Logger } from "@/common/logger.service"
import bootstrap from "./bootstrap"

// const isProduction = process.env.NODE_ENV === "production"

// const logLevels: LogLevel[] = isProduction ? ["error", "warn"] : ["log", "error", "warn", "debug", "verbose"]

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  })
  await bootstrap(app)
}

main()
