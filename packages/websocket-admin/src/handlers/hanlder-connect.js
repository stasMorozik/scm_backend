import { info, warning, exception } from '../loggers';
import { useCaseAuthorization } from '../use-cases/use-case-authorization';

export const handlerConnect = async (request, reply) => {
  try {
    const either = await useCaseAuthorization.auth({
      token: request.query.token
    })

    either.mapLeft((error) => {
      warning({
        args: {
          token: request.query.token,
          application: "websocket-admin"
        },
        message: error.message
      })

      reply
        .code(401)
        .type("application/json")
        .send({message: error.message})
    })

    either.mapRight(() => {
      info({
        args: {
          token: request.query.token,
          application: "websocket-admin"
        },
        message: "Успешная авторизация"
      })
    })
  } catch (e) {    
    exception({
      args: {
        token: request.query.token,
        application: "websocket-admin"
      },
      message: e.message
    })

    reply
      .code(500)
      .type("application/json")
      .send({message: "Что то пошло не так"})
  }
}