import Joi from 'joi'
import { GenderType } from 'entities'
import { FastifyPluginCallback } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { badRequestResponse } from 'error/exception'
import { authService } from 'service/auth'

import { SignupBody } from './dto/signup.dto'
import { SigninBody } from './dto/SignIn.dto'
import { CheckParams } from './dto/check.dto'

import CheckEmailJsonSchema from 'schema/auth/checkEmail.json'
import CheckUsernameJsonSchema from 'schema/auth/checkUsername.json'
import SignupBodyJsonSchema from 'schema/auth/signup.json'
import SigninBodyJsonSchema from 'schema/auth/signin.json'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get(
    '/check/email/:value',
    {
      schema: {
        params: CheckEmailJsonSchema,
      },
    },
    async (request, reply) => {
      const { value } = request.params as CheckParams
      try {
        const result = await authService.checkValue('email', value)
        reply.status(StatusCodes.OK).send(result)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  )

  fastify.get(
    '/check/username/:value',
    {
      schema: {
        params: CheckUsernameJsonSchema,
      },
    },
    async (request, reply) => {
      const { value } = request.params as CheckParams
      try {
        const result = await authService.checkValue('username', value)
        reply.status(StatusCodes.OK).send(result)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  )

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

        reply
          .setCookie('refresh_token', result.data.refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
          })
          .status(StatusCodes.OK)
          .send(result)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  )
  done()
}

export default authRoute
