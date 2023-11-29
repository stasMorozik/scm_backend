import { rabbitConnection } from './rabbit-connection';

const publisher = rabbitConnection.createPublisher({
  confirm: true,
  maxAttempts: 2,
  exchanges: [{exchange: process.env.AMQP_EXCHANGE, type: 'topic'}]
})

const deviceChangeRouting = {
  exchange: process.env.AMQP_EXCHANGE, 
  routingKey: process.env.AMQP_DEVICE_CHANGE_ROUTING
}

const playlistChangeRouting = {
  exchange: process.env.AMQP_EXCHANGE, 
  routingKey: process.env.AMQP_PLAYLIST_CHANGE_ROUTING
}

export const notifyDevice = (args = {}) => {
  publisher.send(deviceChangeRouting, args)
}

export const notifyService = (args = {}) => {
  publisher.send(playlistChangeRouting, args)
}