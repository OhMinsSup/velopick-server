import {
  Entity,
  OneToOne,
  Property,
  BeforeCreate,
  BeforeUpdate,
  Index,
} from '@mikro-orm/core'
import * as bcrypt from 'bcrypt'
import { generateToken } from '../libs/tokens'
import { BaseEntity } from './BaseEntity'
import { UserProfile } from './UserProfile'

@Entity()
export class User extends BaseEntity {
  @Index()
  @Property({
    nullable: false,
    unique: true,
    type: 'string',
    comment: '유저 이메일',
  })
  email: string

  @Property({ nullable: false, type: 'string', comment: '패스워드' })
  password: string

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    owner: true,
  })
  profile: UserProfile

  /**
   * @version 1.0
   * @description 비밀번호 hash 생성
   */
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

  /**
   * @version 1.0
   * @description 비밀번호 체크
   */
  async checkPassword(password: string): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, this.password)
      return result
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  /**
   * @version 1.0
   * @description 유저 인증 토큰 생성
   */
  async generateUserToken() {
    // refresh token is valid for 30days
    const refreshToken = await generateToken(
      {
        user_id: this.id,
      },
      {
        subject: 'refresh_token',
        expiresIn: '30d',
      }
    )

    const accessToken = await generateToken(
      {
        user_id: this.id,
      },
      {
        subject: 'access_token',
        expiresIn: '1h',
      }
    )

    return {
      refreshToken,
      accessToken,
    }
  }
}
