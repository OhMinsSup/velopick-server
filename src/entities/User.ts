import {
  Entity,
  OneToOne,
  Property,
  Unique,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core'
import * as bcrypt from 'bcrypt'
import { DI } from 'index'
import { generateToken } from 'libs/tokens'
import { AuthToken } from './AuthToken'
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
    const authToken = new AuthToken()
    authToken.userId = this.id

    await DI.authTokenRespository.persist(authToken).flush()

    // refresh token is valid for 30days
    const refreshToken = await generateToken(
      {
        user_id: this.id,
        token_id: authToken.id,
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
