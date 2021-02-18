import { Repository } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/mongodb'
import { User } from 'entities'

@Repository(User)
export class UserRepository extends EntityRepository<User> {}
