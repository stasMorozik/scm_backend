import { rabbitConnection } from './src/rabbit-connection';
import { updatingPlaylistHandler } from './src/handlers/updating-playlist-handler';

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
    routingKey: process.env.AMQP_PLAYLIST_CHANGE_ROUTING
  }],
}, async (msg) => {
  if (msg.body.id && msg.body.token) {
    updatingPlaylistHandler(msg.body)
  }
})