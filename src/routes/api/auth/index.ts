import Joi from 'joi'
import { FastifyPluginCallback } from 'fastify'
import { StatusCodes } from 'http-status-codes'

import { GenderType } from '../../../entities'
import { successResponse } from '../../../libs/response'
import { badRequestResponse } from '../../../error/exception'
import { authService } from '../../../service/auth'

import { SignupBody } from './dto/signup.dto'
import { SigninBody } from './dto/SignIn.dto'

import SignupJsonSchema from '../../../schema/auth/signup.json'
import SigninJsonSchema from '../../../schema/auth/signin.json'
import LogoutJsonSchema from '../../../schema/auth/logout.json'

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.post(
    '/signup',
    {
      schema: SignupJsonSchema,
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
        birthday: Joi.number().required(),
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
      schema: SigninJsonSchema,
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
            path: '/',
          })
          .setCookie('access_token', result.data.accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            path: '/',
          })
          .status(StatusCodes.OK)
          .send(result)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  )

  fastify.post('/logout', { schema: LogoutJsonSchema }, (request, reply) => {
    reply
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .status(StatusCodes.OK)
      .send(successResponse({ data: null }))
  })

  done()
}

export default authRoute
