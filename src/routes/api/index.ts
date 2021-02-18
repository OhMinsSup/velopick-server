import { FastifyPluginCallback } from 'fastify'
import authRoute from './auth'

const apiRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoute, { prefix: '/auth' })
  done()
}

export default apiRoute
