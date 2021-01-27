import { INestApplication } from "@nestjs/common"
// const FileStore = require("session-file-store")(session)
const session = require("express-session")
const RedisStore = require("connect-redis")(session)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sessionPlugin = (_app?: INestApplication) => {
  // const fileStore = new FileStore({
  //   path: "./storage/sessions",
  // })
  // const plugin = session({
  //   secret: "kova",
  //   name: "kova_session",
  //   cookie: { maxAge: 60000 * 60 * 1200, domain: ".loyep.com" },
  //   resave: false,
  //   saveUninitialized: true,
  //   store: fileStore,
  // })

  const client = require("redis").createClient({
    db: 1,
    host: "140.143.245.194",
    port: 6379,
    password: "heli921227",
  })

  const plugin = session({
    name: "kova_session",
    secret: "kova",
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 * 1200, domain: ".loyep.com" },
    store: new RedisStore({
      client,
    }),
  })
  return plugin
}
