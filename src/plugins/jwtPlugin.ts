import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { decodeToken } from '../libs/tokens'

type TokenData = {
  iat: number
  exp: number
  sub: string
  iss: string
}

type AccessTokenData = {
  user_id: number
} & TokenData

declare module 'fastify' {
  interface FastifyRequest {
    user: null | { id: number }
  }
}

const callback: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.routerPath.includes('/auth/logout')) {
      return
    }

    let accessToken: string | undefined = request.cookies.access_token

    const { authorization } = request.headers
    if (!accessToken && authorization) {
      accessToken = authorization.split(' ')[1]
    }

    try {
      if (!accessToken) {
        const error = new Error()
        error.name = 'No Access Token'
        throw error
      }

      const decoded = await decodeToken<AccessTokenData>(accessToken)
      request.user = {
        id: decoded.user_id,
      }
    } catch (error) {
      // someting...
    }
  })
  done()
}

const jwtPlugin = fp(callback, {
  name: 'jwtPlugin',
})

export default jwtPlugin
