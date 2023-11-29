import { rabbitConnection } from './rabbit-connection';

const publisher = rabbitConnection.createPublisher({
  confirm: true,
  maxAttempts: 2,
  exchanges: [{exchange: process.env.AMQP_EXCHANGE, type: 'topic'}]
})

const deviceConnectionChangeRouting = {
  exchange: process.env.AMQP_EXCHANGE, 
  routingKey: process.env.AMQP_DEVICE_CONNECTION_CHANGE_ROUTING
}

export const notifyAdmin = (args = {}) => {
  publisher.send(deviceConnectionChangeRouting, args)
}