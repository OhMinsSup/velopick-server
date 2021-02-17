import { Entity, JsonType, Property, Unique } from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'

export type SocialLink = {
  [key: string]: string
}

@Entity()
export class UserProfile extends BaseEntity {
  @Unique()
  @Property({ nullable: false, type: 'string' })
  username: string

  @Property({ type: 'string' })
  address: string

  @Property({ type: 'string' })
  thumbnailUrl: string

  @Property({ type: 'string' })
  shortBio: string

  @Property({ type: JsonType, nullable: true })
  socialLinks?: SocialLink
}
