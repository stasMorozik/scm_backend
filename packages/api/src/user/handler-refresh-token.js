import { UseCaseRefreshingToken } from 'core';
import { info, warning, exception } from '../loggers';

const useCase = new UseCaseRefreshingToken(
  process.env.SECRET_KEY
)

export const handlerRefreshToken = async (request, reply) => {
  try {
    const either = await useCase.refresh({
      token: request.cookies["refresh-token"]
    })

    either.mapLeft((error) => {
      warning({
        args: {
          token: request.cookies["refresh-token"],
          application: "api"
        },
        message: error.message
      })

      reply
        .code(401)
        .type("application/json")
        .send({message: error.message})
    })

    either.mapRight((tokens) => {
      info({
        args: {
          token: request.cookies["refresh-token"],
          application: "api"
        },
        message: "Обновлен токен"
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
  } catch (e) {
    exception({
      args: {
        token: request.cookies["refresh-token"],
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