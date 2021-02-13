import 'dotenv/config'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import User from 'entity/User'
import Server from './Server'

const {
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DATABASE,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
} = process.env

const envs = [
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DATABASE,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
]

if (!envs.every(Boolean)) {
  const error = new Error('Database Env is Notfound')
  error.message = 'mongodb database connect error: env is not found'
  throw error
}

createConnection({
  type: 'mongodb',
  username: MONGODB_USERNAME,
  password: MONGODB_PASSWORD,
  host: MONGODB_HOST,
  port: parseInt(MONGODB_PORT || '27017', 10),
  database: MONGODB_DATABASE,
  useUnifiedTopology: true,
  authSource: 'admin',
  logging:
    process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [User],
})
  .then(async (connection) => {
    console.log('🚀 Mongo Database connecting...')
    const server = new Server()
    server.start()
  })
  .catch((error) => console.log(error))
