import { INestApplication } from "@nestjs/common"
import * as session from "express-session"
const FileStore = require("session-file-store")(session)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sessionPlugin = (_app?: INestApplication) => {
  const fileStore = new FileStore({
    path: "./storage/sessions",
  })
  const plugin = session({
    secret: "kova",
    name: "kova_session",
    cookie: { maxAge: 60000 * 60 * 1200, domain: ".loyep.com" },
    resave: false,
    saveUninitialized: true,
    store: fileStore,
  })
  return plugin
}
