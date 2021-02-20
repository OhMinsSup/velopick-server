import { ResponseType, successResponse } from 'libs/response'
import { existsResponse } from 'error/exception'
import { DI } from 'index'
import { SignupBody } from 'routes/api/auth/dto/Signup.dto'
import { User, UserProfile } from 'entities'

interface AuthServiceInterface {
  signup: (body: SignupBody) => Promise<ResponseType>
}

class AuthService implements AuthServiceInterface {
  async signup(body: SignupBody): Promise<ResponseType> {
    try {
      const [exists, ok] = await this.findByUsernameOrEmail(
        body.username,
        body.email
      )

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
      profile.birthday = body.birthday

      const user = new User()
      user.email = body.email
      user.password = body.password
      user.profile = profile

      await DI.userRepository.persist(user).flush()

      return successResponse({ data: user })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public async findByUsernameOrEmail(
    username?: string,
    email?: string
  ): Promise<['email' | 'username' | null, boolean]> {
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

export default AuthService
