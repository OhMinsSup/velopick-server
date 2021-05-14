import { FastifyPluginCallback } from 'fastify'
import authRoute from './auth'
import userRoute from './user'
import pickRoute from './pick'

const apiRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(userRoute, { prefix: '/user' })
  fastify.register(pickRoute, { prefix: '/pick' })
  done()
}

export default apiRoute
