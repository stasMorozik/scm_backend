import { UseCaseAuthorization } from 'core';
import { GettingUserById } from 'postgresql-adapters';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';

export const useCase = new UseCaseAuthorization(
  new GettingUserById(postgresPool),
  process.env.SECRET_KEY
)

export const handlerAuthorization = async (request, reply) => {
  try {
    const either = await useCase.auth({
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

      reply
        .code(401)
        .type("application/json")
        .send({message: error.message})
    })

    either.mapRight((user) => {
      info({
        args: {
          token: request.cookies["access-token"],
          application: "api"
        },
        message: "Успешная авторизация"
      })
      
      reply
        .code(200)
        .type("application/json")
        .send({
          email: user.email,
          name: user.name,
          surname: user.surname
        })
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