import 'dotenv/config'
import 'reflect-metadata'
import { EntityManager, MikroORM } from '@mikro-orm/core'

import Server from './Server'
import { AuthToken, User, UserProfile } from 'entities'
import { EntityRepository } from '@mikro-orm/mongodb'

export const DI = {} as {
  orm: MikroORM
  em: EntityManager
  userRepository: EntityRepository<User>
  userProfileRespository: EntityRepository<UserProfile>
  authTokenRespository: EntityRepository<AuthToken>
}

async function bootstrap() {
  DI.orm = await MikroORM.init()
  DI.em = DI.orm.em
  DI.userRepository = DI.em.getRepository(User)
  DI.userProfileRespository = DI.em.getRepository(UserProfile)
  DI.authTokenRespository = DI.em.getRepository(AuthToken)

  const server = new Server()
  server.start()
}

bootstrap()
