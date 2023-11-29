import { UseCaseCreatingToken } from 'core';
import { useCase as authorizationUseCase } from '../user/handler-authorization';
import { info, warning, exception } from '../loggers';
import { errorHandler } from '../error-handler';

const useCase = new UseCaseCreatingToken(
  authorizationUseCase,
  process.env.SECRET_KEY
)

export const handlerCreatingToken = async (request, reply) => {
  try {
    const either = await useCase.create({
      token: request.cookies["access-token"]
    })

    either.mapLeft((error) => {
      warning({
        args: {
          token: request.cookies["access-token"],
          application: "api"
        },
        message: error.message
      })

      errorHandler(error, reply)
    })

    either.mapRight((tokens) => {
      info({
        args: {
          token: request.cookies["access-token"],
          application: "api"
        },
        message: "Создан токен"
      })

      reply
        .code(200)
        .type("application/json")
        .send(tokens)
    })
  } catch (e) {
    exception({
      args: {
        token: request.cookies["access-token"],
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