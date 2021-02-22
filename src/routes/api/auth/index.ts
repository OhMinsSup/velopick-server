import Joi from 'joi'
import { GenderType } from 'entities'
import { FastifyPluginCallback } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { SignupBody, SignupBodyJsonSchema } from './dto/signup.dto'
import { badRequestResponse } from 'error/exception'
import { authService } from 'service/auth'
import { SigninBody, SigninBodyJsonSchema } from './dto/SignIn.dto'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.post(
    '/signup',
    {
      schema: {
        body: SignupBodyJsonSchema,
      },
    },
    async (request, reply) => {
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
        reply
          .status(StatusCodes.BAD_REQUEST)
          .send(badRequestResponse({ message: result.error.message }))
        return
      }

      try {
        const result = await authService.signup(request.body as SignupBody)
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

  fastify.post(
    '/signin',
    {
      schema: {
        body: SigninBodyJsonSchema,
      },
    },
    async (request, reply) => {
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })

      const result = schema.validate(request.body)
      if (result.error) {
        reply
          .status(StatusCodes.BAD_REQUEST)
          .send(badRequestResponse({ message: result.error.message }))
        return
      }

      try {
        const result = await authService.signin(request.body as SigninBody)
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

export default authRoute
