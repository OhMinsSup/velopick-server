import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'

@Entity()
export class AuthToken extends BaseEntity {
  @Property()
  userId: string
}
