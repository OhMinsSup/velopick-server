import { FastifyPluginCallback } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import omit from 'lodash/omit'

import { successResponse } from '../../../libs/response'
import userPlugin from '../../../plugins/userPlugin'
import MeJsonSchema from '../../../schema/user/me.json'

const userRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(userPlugin, { fetchUser: true })

  fastify.get(
    '/',
    {
      schema: MeJsonSchema,
    },
    (request, reply) => {
      reply.status(StatusCodes.OK).send(
        successResponse({
          data: request.userData,
        })
      )
    }
  )

  done()
}

export default userRoute
