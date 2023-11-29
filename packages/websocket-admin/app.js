import Fastify from 'fastify';
import websocker from '@fastify/websocket';
import { handlerConnect } from './src/handlers/hanlder-connect';
import { rabbitConnection } from './src/rabbit-connection';

const sockets = {}

const fastify = Fastify({
  logger: parseInt(process.env.PRODUCTION) ? true : false
})

fastify.register(websocker)

fastify.addHook('preValidation', async (request, reply) => {
  await handlerConnect(request, reply)
})

fastify.register(async function (fastify) {
  fastify.get('/*', { websocket: true }, (connection, request) => {
    sockets[request.query.token] = connection.socket

    connection.socket.on('close', async () => {
      delete sockets[request.query.token]
    })
  })
})

rabbitConnection.createConsumer({
  queue: process.env.AMQP_QUEUE,
  queueOptions: {durable: true},
  qos: {prefetchCount: 2},
  exchanges: [{
    exchange: process.env.AMQP_EXCHANGE, 
    type: 'topic'
  }],
  queueBindings: [{
    exchange: process.env.AMQP_EXCHANGE, 
    routingKey: process.env.AMQP_DEVICE_CONNECTION_CHANGE_ROUTING
  }],
}, async (msg) => {
  if(msg.body.id && msg.body.isActive != undefined) {
    for (let token in sockets) {
      sockets[token].send(JSON.stringify(msg.body))
    }
  }
})

try {
  await fastify.listen({ port: process.env.PORT })
  console.log(`listen ${process.env.PORT}`)
} catch (e) {
  console.log(e)
  process.exit(1)
}