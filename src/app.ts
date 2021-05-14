import 'dotenv/config'
import 'reflect-metadata'
import { EntityManager, MikroORM, EntityRepository } from '@mikro-orm/core'

import Server from './Server'
import { User, UserProfile, Pick } from './entities'

export const DI = {} as {
  orm: MikroORM
  em: EntityManager
  userRepository: EntityRepository<User>
  userProfileRespository: EntityRepository<UserProfile>
  pickRespository: EntityRepository<Pick>
}

async function bootstrap() {
  DI.orm = await MikroORM.init()
  DI.em = DI.orm.em
  DI.userRepository = DI.em.getRepository(User)
  DI.userProfileRespository = DI.em.getRepository(UserProfile)
  DI.pickRespository = DI.em.getRepository(Pick)

  const server = new Server()

  await server.start()

  server.app.log.info(`🚀 Velopick Server Listening`)
}

bootstrap()
