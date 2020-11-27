import * as path from 'path';

export default {
  db: {
    type: 'mysql',
    host: 'bj-cdb-m0cdymy6.sql.tencentcdb.com',
    port: 61527,
    charset: 'utf8mb4',
    username: 'loyep',
    password: 'iHMeK6Od8bLiEm9h',
    database: 'kova',
    synchronize: false,
    entities: [path.join(__dirname, '../entity/**/*.entity{.ts,.js}')],
    logging: 'all', // query, error, schema, warn, info, log, all
    logger: 'simple-console',
    maxQueryExecutionTime: 500, // 单位毫秒
  },
};
