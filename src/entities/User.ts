import { Entity, OneToOne, Property, Unique } from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'
import { UserProfile } from './UserProfile'

@Entity()
export class User extends BaseEntity {
  @Unique()
  @Property({ nullable: false, type: 'string' })
  email: string

  @Property({ nullable: false, type: 'string' })
  password: string

  @OneToOne(() => UserProfile)
  profile: UserProfile
}
