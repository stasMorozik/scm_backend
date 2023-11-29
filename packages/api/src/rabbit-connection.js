import { Connection } from 'rabbitmq-client';

const amqpUser = process.env.AMQP_USER
const amqpPassword = process.env.AMQP_PASSWORD
const amqpHost = process.env.AMQP_HOST
const amqpPort = parseInt(process.env.AMQP_PORT)

export const rabbitConnection = new Connection(`amqp://${amqpUser}:${amqpPassword}@${amqpHost}:${amqpPort}`)