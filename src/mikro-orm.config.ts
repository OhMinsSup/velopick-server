import { Options } from '@mikro-orm/core'
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter'
import { User, UserProfile, BaseEntity } from './entities'

const options: Options = {
  type: 'mongo',
  entities: [User, UserProfile, BaseEntity],
  dbName: process.env.MONGODB_DATABASE,
  highlighter: new MongoHighlighter(),
  debug: true,
  host: process.env.MONGODB_HOST,
  port: +process.env.MONGODB_PORT,
  user: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  ensureIndexes: true,
}

export default options
