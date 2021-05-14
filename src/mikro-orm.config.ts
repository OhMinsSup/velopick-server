import { Options } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { User, UserProfile, Pick, BaseEntity } from './entities'

const options: Options = {
  type: 'mariadb',
  entities: [User, UserProfile, Pick, BaseEntity],
  dbName: process.env.DB_DATABASE,
  debug: true,
  highlighter: new SqlHighlighter(),
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: './src/migrations', // path to the folder with migrations
    pattern: /^[\w-]+\d+\.ts$/, // regex pattern for the migration files
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    safe: false, // allow to disable table and column dropping
    emit: 'ts', // migration generation mode
  },
}

export default options
