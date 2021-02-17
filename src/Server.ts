import { RequestContext } from '@mikro-orm/core'
import fastify from 'fastify'
import compress from 'fastify-compress'
import { DI } from 'index'
import middie from 'middie'

const PORT = parseInt(process.env.PORT!, 10)

export default class Server {
  app = fastify({ logger: true })

  constructor() {
    this.setup()
  }

  async setup() {
    await this.app.register(middie)
    this.app.register(compress)
    this.app.use((req, res, next) => RequestContext.create(DI.orm.em, next))
  }

  start() {
    try {
      this.app.listen(PORT, (err, address) => {
        if (err) throw err
        console.log(`🚀 Velopick Server listening on ${address}`)
      })
    } catch (e) {
      this.app.log.error(e)
    }
  }
}
