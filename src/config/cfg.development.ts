import { TypeOrmLogger } from "@/common/typeorm-logger"
import * as path from "path"

export default {
  db: {
    type: "mysql",
    host: "bj-cdb-m0cdymy6.sql.tencentcdb.com",
    port: 61527,
    charset: "utf8mb4",
    username: "kova",
    password: "iHMeK6Od8bLiEm9h",
    database: "kova",
    synchronize: false,
    entities: [path.join(__dirname, "../entity/**/*.entity{.ts,.js}")],
    logging: "all", // query, error, schema, warn, info, log, all
    logger: new TypeOrmLogger(),
    maxQueryExecutionTime: 500, // 单位毫秒
  },
}
