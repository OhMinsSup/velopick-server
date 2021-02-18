import Joi from 'joi'
import { GenderType } from 'entities'
import { FastifyPluginCallback } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import AuthService from 'service/auth'

const SignupBodyJsonSchema = {
  type: 'object',
  required: ['email', 'password', 'username'],
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    username: { type: 'string' },
    gender: {
      type: 'string',
      enum: [GenderType.Male, GenderType.FeMale],
    },
    birthday: {
      type: ['string', 'null'],
    },
  },
}

const authService = new AuthService()

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.post(
    '/signup',
    {
      schema: {
        body: SignupBodyJsonSchema,
      },
    },
    (request, reply) => {
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        username: Joi.string()
          .regex(/^[a-z0-9-_]+$/)
          .min(3)
          .max(16)
          .required(),
        gender: Joi.string()
          .valid(GenderType.Male, GenderType.FeMale)
          .optional(),
        birthday: Joi.string().allow(null),
      })

      const result = schema.validate(request.body)
      if (result.error) {
        reply.status(StatusCodes.BAD_REQUEST).send({
          ok: false,
          message: result.error.message,
          resultCode: 0,
          statusCode: StatusCodes.BAD_REQUEST,
          data: null,
        })
        return
      }

      console.log(request.body)
      reply.send(request.body)
    }
  )
  done()
}

export default authRoute
