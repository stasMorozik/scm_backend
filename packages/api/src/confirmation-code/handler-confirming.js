import contentTypeParser from 'fast-content-type-parse';
import { UseCaseConfirmationCodeConfirming } from 'core';
import { UpdatingConfirmationCode} from 'postgresql-adapters';
import { GettingConfirmationCode } from 'postgresql-adapters';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';

const useCase = new UseCaseConfirmationCodeConfirming(
  new UpdatingConfirmationCode(postgresPool),
  new GettingConfirmationCode(postgresPool)
)

export const handlerConfirming = async (request, reply) => {
  try {
    const parsed = contentTypeParser.parse(request.headers['content-type'])

    if (parsed.type != 'application/json') {
      reply
        .code(405)
        .type("application/json")
        .send({message: "Неразрешённый content-type"})
    }

    if (parsed.type == 'application/json') {
      const either = await useCase.confirm(request.body)

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

      either.mapRight(() => {
        info({
          args: {
            body: request.body,
            application: "api"
          },
          message: "Электронная почта подтверждена"
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