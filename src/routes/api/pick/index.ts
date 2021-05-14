import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { FastifyPluginCallback } from 'fastify'

import userPlugin from '../../../plugins/userPlugin'
import CreatePickJsonSchema from '../../../schema/pick/create-pick.json'
import { badRequestResponse } from '../../../error/exception'
import { pickService } from '../../../service/pick'
import { CreatePickBody } from './dto/create-pick.dto'

const pickRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(userPlugin, { fetchUser: true })

  fastify.post(
    '/',
    { schema: CreatePickJsonSchema },
    async (request, reply) => {
      const schema = Joi.object().keys({
        title: Joi.string().min(1).max(150).required(),
        description: Joi.string().max(255).allow(null).allow(''),
        is_private: Joi.boolean().allow(null),
        is_temp: Joi.boolean().allow(null),
        url_slug: Joi.string().allow(null).allow(''),
      })

      const result = schema.validate(request.body)
      if (result.error) {
        reply
          .status(StatusCodes.BAD_REQUEST)
          .send(badRequestResponse({ message: result.error.message }))
        return
      }

      try {
        const body = request.body as CreatePickBody
        const result = await pickService.createPick(body, request.userData)
        if (!result.ok) {
          reply.status(result.statusCode).send(result)
          return
        }

        reply.status(StatusCodes.OK).send(result)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  )
  done()
}

export default pickRoute
