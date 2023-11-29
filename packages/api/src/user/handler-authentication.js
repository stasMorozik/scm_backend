import contentTypeParser from 'fast-content-type-parse';
import { UseCaseAuthentication } from 'core';
import { GettingUserByEmail } from 'postgresql-adapters';
import { GettingDeletingConfirmationCode } from 'postgresql-adapters';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';

const useCase = new UseCaseAuthentication(
  new GettingUserByEmail(postgresPool),
  new GettingDeletingConfirmationCode(postgresPool),
  process.env.SECRET_KEY
)

export const handlerAuthentication = async (request, reply) => {
  try {
    const parsed = contentTypeParser.parse(request.headers['content-type'])

    if (parsed.type != 'application/json') {
      reply
        .code(405)
        .type("application/json")
        .send({message: "Неразрешённый content-type"})
    }

    if (parsed.type == 'application/json') {
      const either = await useCase.auth(request.body)

      either.mapLeft((error) => {
        warning({
          args: {
            body: request.body,
            application: "api"
          },
          message: error.message
        })

        reply
          .code(400)
          .type("application/json")
          .send({message: error.message})
      })

      either.mapRight((tokens) => {
        info({
          args: {
            body: request.body,
            application: "api"
          },
          message: "Успешная аутентификацию"
        })

        reply
          .code(200)
          .type("application/json")
          .setCookie("access-token", tokens.access, {
            path: '/',
            signed: false
          })
          .setCookie("refresh-token", tokens.refresh, {
            path: '/',
            signed: false
          })
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