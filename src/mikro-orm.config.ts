import { Options } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { User, UserProfile, BaseEntity } from './entities'

const options: Options = {
  type: 'mariadb',
  entities: [User, UserProfile, BaseEntity],
  dbName: process.env.DB_DATABASE,
  debug: true,
  highlighter: new SqlHighlighter(),
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
}

export default options
