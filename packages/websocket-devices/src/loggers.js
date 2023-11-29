import { rabbitConnection } from './rabbit-connection';

const publisher = rabbitConnection.createPublisher({
  confirm: true,
  maxAttempts: 2,
  exchanges: [{exchange: process.env.AMQP_EXCHANGE, type: 'topic'}]
})

const routingException = {
  exchange: process.env.AMQP_EXCHANGE, 
  routingKey: process.env.AMQP_LOGS_EXCEPTION_ROUTING
}

const routingInfo = {
  exchange: process.env.AMQP_EXCHANGE, 
  routingKey: process.env.AMQP_LOGS_INFO_ROUTING
}

const routingWarning = {
  exchange: process.env.AMQP_EXCHANGE, 
  routingKey: process.env.AMQP_LOGS_WARNING_ROUTING
}

const routingDebug = {
  exchange: process.env.AMQP_EXCHANGE, 
  routingKey: process.env.AMQP_LOGS_DEBUG_ROUTING
}

const log = (routing, args) => {
  args.date = new Date().toLocaleString()

  publisher.send(routing, args)
}

export const exception = (args) => {
  log(routingException, args)
}

export const info = (args) => {
  log(routingInfo, args)
}

export const warning = (args) => {
  log(routingWarning, args)
}

export const debug = (args) => {
  log(routingDebug, args)
}