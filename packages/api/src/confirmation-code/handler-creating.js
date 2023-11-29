import contentTypeParser from 'fast-content-type-parse';
import { UseCaseConfirmationCodeCreating } from 'core';
import { InsertingConfirmationCode } from 'postgresql-adapters';
import { NotifierByMail } from 'smtp-adapters';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';

const usCase = new UseCaseConfirmationCodeCreating(
  new InsertingConfirmationCode(postgresPool),
  new NotifierByMail(
    process.env.SMTP_HOST,
    parseInt(process.env.SMTP_PORT),
    parseInt(process.env.SMTP_SECURE) ? true : false,
    process.env.SMTP_USER,
    process.env.SMTP_PASSWORD
  )
)

export const handlerCreating = async (request, reply) => {
  try {
    const parsed = contentTypeParser.parse(request.headers['content-type'])

    if (parsed.type != 'application/json') {
      reply
        .code(405)
        .type("application/json")
        .send({message: "Неразрешённый content-type"})
    }

    if (parsed.type == 'application/json') {
      const either = await usCase.create(request.body)

      either.mapLeft((error) => {
        warning({
          args: {
            body: request.body,
            application: "api"
          },
          message: error.message
        })
  
        reply.code(400)
          .type("application/json")
          .send({message: error.message})
      })
  
      either.mapRight(() => {
        info({
          args: {
            body: request.body,
            application: "api"
          },
          message: "Создан код подтверждения"
        })
        
        reply
          .code(200)
          .type("application/json")
          .send(true)
      })
    }
  } catch (e) {
    exception({
      args: {
        body: request.body,
        application: "api"
      },
      message: e.message
    })

    reply
      .code(500)
      .type("application/json")
      .send({message: "Что то пошло не так"})
  }
}