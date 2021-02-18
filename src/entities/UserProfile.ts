import { Entity, Enum, JsonType, Property, Unique } from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'

export type SocialLink = {
  [key: string]: string
}

export enum GenderType {
  Male = 'M',
  FeMale = 'F',
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

  @Property({ type: 'string' })
  birthday: string

  @Enum()
  gender: GenderType

  @Property({ type: JsonType, nullable: true })
  socialLinks?: SocialLink
}
