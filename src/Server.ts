import fastify from 'fastify'
import compress from 'fastify-compress'
import cookie from 'fastify-cookie'
import corsPlugin from 'fastify-cors'
import middie from 'middie'

import jwtPlugin from './plugins/jwtPlugin'
import apiRoute from './routes/api'

const PORT = parseInt(process.env.PORT!, 10)

export default class Server {
  app = fastify({ logger: true })

  constructor() {
    this.setup()
  }

  async setup() {
    await this.app.register(middie)

    this.app.register(corsPlugin, {
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true)
        }
        const host = origin.split('://')[1]
        const allowedHost = ['localhost:3000']

        const allowed = allowedHost.includes(host)
        callback(null, allowed)
      },
      credentials: true,
    })

    this.app.register(cookie)
    this.app.register(compress)
    this.app.register(jwtPlugin)
    this.app.register(apiRoute, { prefix: '/api' })

    this.app.setErrorHandler((error, request, reply) => {
      reply.send({
        statusCode: error.statusCode,
        name: error.name,
        message: error.message,
        validation: error.validation,
        stack: error.stack,
      })
    })
  }

  start() {
    return this.app.listen(PORT)
  }

  close() {
    return this.app.close()
  }
}
