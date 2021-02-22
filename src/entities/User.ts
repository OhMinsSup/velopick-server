import {
  Entity,
  OneToOne,
  Property,
  Unique,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core'
import * as bcrypt from 'bcrypt'
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

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, this.password)
      return result
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
