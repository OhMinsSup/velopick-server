import fastify from 'fastify'
import compress from 'fastify-compress'

const PORT = parseInt(process.env.PORT!, 10)

export default class Server {
  app = fastify({ logger: true })

  constructor() {
    this.setup()
  }

  setup() {
    this.app.register(compress)
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
