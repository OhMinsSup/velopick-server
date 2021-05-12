import 'dotenv/config'
import 'reflect-metadata'
import { EntityManager, MikroORM, EntityRepository } from '@mikro-orm/core'

import Server from './Server'
import { User, UserProfile } from './entities'

export const DI = {} as {
  orm: MikroORM
  em: EntityManager
  userRepository: EntityRepository<User>
  userProfileRespository: EntityRepository<UserProfile>
}

async function bootstrap() {
  DI.orm = await MikroORM.init()
  DI.em = DI.orm.em
  DI.userRepository = DI.em.getRepository(User)
  DI.userProfileRespository = DI.em.getRepository(UserProfile)

  const server = new Server()

  await server.start()

  server.app.swagger()

  server.app.log.info(`🚀 Velopick Server Listening`)
}

bootstrap()
