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
  signup: (body: SignupBody) => Promise<ResponseType>
  signin: (body: SigninBody) => Promise<ResponseType<SignInData | null>>
}

class AuthService implements AuthServiceInterface {
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
        return exists.email === email ? ['email', true] : ['username', true]
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
