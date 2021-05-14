import {
  Cascade,
  DateType,
  Entity,
  Enum,
  Index,
  JsonType,
  OneToOne,
  Property,
} from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'
import { User } from './User'

export type SocialLink = {
  [key: string]: string
}

export enum GenderType {
  Male = 'M',
  FeMale = 'F',
}

@Entity()
export class UserProfile extends BaseEntity {
  @Index()
  @Property({
    nullable: false,
    type: 'string',
    comment: '회원 이름',
    unique: true,
  })
  username: string

  @Property({ type: 'string', comment: '회원 프로필 이미지', nullable: true })
  thumbnailUrl: string

  @Property({ type: Date, comment: '회원 생일', nullable: false })
  birthday: Date

  @Enum({ items: () => GenderType, comment: '회원 성별', nullable: false })
  gender: GenderType

  @Property({ type: JsonType, comment: '회원 소셜 정보', nullable: true })
  socialLinks?: SocialLink

  @OneToOne(() => User, (user) => user.profile, { cascade: [Cascade.REMOVE] })
  user: User
}
