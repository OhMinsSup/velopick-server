import { DI } from 'app'
import { unauthorizedResponse } from 'error/exception'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { User } from '../entities'

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
      reply.status(401).send(unauthorizedResponse())
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
        reply.status(401).send(unauthorizedResponse())
      }
    }
  })
}

const userPlugin = fp(callback, {
  name: 'userPlugin',
})

export default userPlugin
