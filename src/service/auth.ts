import { StatusCodes } from 'http-status-codes'

import { ResponseType, successResponse } from '../libs/response'
import { DI } from '../app'
import { SignupBody } from '../routes/api/auth/dto/signup.dto'
import { User, UserProfile } from '../entities'
import { SigninBody } from '../routes/api/auth/dto/SignIn.dto'
import {
  customExceptionResponse,
  existsResponse,
  notFoundResponse,
  resultCode,
} from '../error/exception'

type SignInData = {
  refreshToken: string
  accessToken: string
  userId: number
}

interface AuthServiceInterface {
  checkValue: (
    type: 'username' | 'email',
    value: string
  ) => Promise<ResponseType>
  signup: (body: SignupBody) => Promise<ResponseType>
  signin: (body: SigninBody) => Promise<ResponseType<SignInData | null>>
}

class AuthService implements AuthServiceInterface {
  async checkValue(
    type: 'username' | 'email',
    value: string
  ): Promise<ResponseType> {
    try {
      let user: User | UserProfile
      if (type === 'email') {
        user = await DI.userRepository.findOne({ email: value })
      } else {
        user = await DI.userProfileRespository.findOne({
          username: value,
        })
      }

      if (user) {
        let existsType = ''
        if (user instanceof User) {
          existsType = user.email === value ? 'email' : ''
        } else if (user instanceof UserProfile) {
          existsType = user.username === value ? 'username' : ''
        }

        return {
          ok: true,
          statusCode: StatusCodes.OK,
          resultCode: resultCode.EXISTS_CODE,
          message:
            existsType === 'email'
              ? '이미 존재하는 이메일입니다.'
              : '이미 존재하는 유저명입니다.',
          data: existsType,
        }
      }

      return successResponse({ data: null })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async signin(body: SigninBody): Promise<ResponseType<SignInData | null>> {
    try {
      const user = await DI.userRepository.findOne({ email: body.email })
      if (!user) {
        return notFoundResponse({
          message: '존재하지않는 유저입니다. 회원가입 후 이용해주세요.',
          data: null,
        })
      }

      const passwordCorrect = await user.checkPassword(body.password)
      if (!passwordCorrect) {
        return customExceptionResponse({
          statusCode: StatusCodes.OK,
          resultCode: resultCode.EXISTS_PASSWORD,
          message: '비밀번호가 일치하지않습니다.',
          data: null,
        })
      }

      const tokens = await user.generateUserToken()

      return successResponse({
        data: {
          userId: user.id,
          ...tokens,
        },
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async signup(body: SignupBody): Promise<ResponseType> {
    try {
      const [exists, ok] = await this.findByUsernameOrEmail({
        email: body.email,
        username: body.username,
      })

      if (ok && exists) {
        return existsResponse({
          data: {
            exists,
          },
          message:
            exists === 'email'
              ? '이미 사용중인 이메일입니다. 다시 입려해주세요.'
              : '이미 사용중인 유저명입니다. 다시 입력해주세요.',
        })
      }

      const profile = new UserProfile()
      profile.username = body.username
      profile.gender = body.gender
      profile.birthday = new Date(body.birthday)

      await DI.userProfileRespository.persist(profile).flush()

      const user = new User()
      user.email = body.email
      user.password = body.password
      user.profile = profile

      await DI.userRepository.persist(user).flush()

      return successResponse({
        data: null,
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  private async findByUsernameOrEmail({
    email,
    username,
  }: {
    username?: string
    email?: string
  }): Promise<['email' | 'username' | null, boolean]> {
    try {
      const exists = await DI.userRepository.findOne(
        {
          $or: [
            {
              email,
            },
            {
              profile: {
                username,
              },
            },
          ],
        },
        ['profile']
      )

      if (exists) {
        return exists.email ? ['username', true] : ['email', true]
      }

      return [null, false]
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

const authService = new AuthService()

export { authService }
