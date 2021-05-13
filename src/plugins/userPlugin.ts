import { DI } from 'app'
import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { User } from '../entities'
import CustomError from '../error/customError'

declare module 'fastify' {
  interface FastifyRequest {
    userData: User | null
  }
}

const callback: FastifyPluginAsync<{ fetchUser: boolean }> = async (
  fastify,
  opts
) => {
  const { fetchUser = true } = opts
  fastify.decorateRequest('userData', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (!request.user) {
      reply.status(401)
      throw new Error('Unauthorized')
    }

    if (fetchUser) {
      const userData = await DI.userRepository.findOne(
        {
          id: request.user.id,
        },
        ['profile']
      )

      request.userData = userData ?? null
      if (!userData) {
        throw new CustomError({
          statusCode: 401,
          name: 'UnauthorizedError',
          message: 'Not logged in',
        })
      }
    }
  })
}

const userPlugin = fp(callback, {
  name: 'userPlugin',
})

export default userPlugin
