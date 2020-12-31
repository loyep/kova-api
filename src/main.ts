import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { Logger } from "@nestjs/common"
import bootstrap from "./bootstrap"

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === "development" ? new Logger() : false,
  })
  await bootstrap(app)
}

main()
