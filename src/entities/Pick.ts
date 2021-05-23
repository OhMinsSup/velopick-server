import {
  Cascade,
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'
import { User } from './User'

@Entity()
export class Pick extends BaseEntity {
  @Index()
  @Property({
    type: 'string',
    length: 255,
    unique: true,
    nullable: false,
    comment: 'pick의 주소',
  })
  url_slug: string

  @Property({ type: 'string', comment: 'pick의 타이틀', nullable: false })
  title: string

  @Property({ type: 'string', length: 255, comment: 'pick의 설명' })
  description: string

  @Property({ type: 'boolean', default: true, comment: 'pick의 공개여부' })
  is_private: boolean

  @Property({
    type: 'boolean',
    default: false,
    comment: 'pick의 임시저장 여부',
  })
  is_temp: boolean

  @ManyToOne({ entity: () => User, cascade: [Cascade.ALL], eager: true })
  ownerUser: User

  @ManyToMany({ entity: () => User, owner: true })
  pickUsers = new Collection<User>(this)
}
