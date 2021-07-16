import { FastifyPluginCallback } from 'fastify'
import authRoute from './auth'
import userRoute from './user'
import pickRoute from './pick'

const apiRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(userRoute, { prefix: '/users' })
  fastify.register(pickRoute, { prefix: '/picks' })
  done()
}

export default apiRoute
