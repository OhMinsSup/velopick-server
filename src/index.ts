import 'dotenv/config'
import 'reflect-metadata'
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core'

import Server from './Server'
import { User } from 'entities'

export const DI = {} as {
  orm: MikroORM
  em: EntityManager
  userRepository: EntityRepository<User>
}

async function bootstrap() {
  DI.orm = await MikroORM.init()
  DI.em = DI.orm.em
  DI.userRepository = DI.orm.em.getRepository(User)

  const server = new Server()
  server.start()
}

bootstrap()
