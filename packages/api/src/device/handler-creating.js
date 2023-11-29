import contentTypeParser from 'fast-content-type-parse';
import { UseCaseDeviceCreating } from 'core';
import { InsertingDevice } from 'postgresql-adapters';
import { GettingPlaylistById } from 'postgresql-adapters';
import { useCase as authorizationUseCase } from '../user/handler-authorization';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';
import { errorHandler } from '../error-handler';

const useCase = new UseCaseDeviceCreating(
  authorizationUseCase,
  new GettingPlaylistById(postgresPool),
  new InsertingDevice(postgresPool)
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
      const either = await useCase.create({
        ...request.body,
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
  
      either.mapRight(() => {
        info({
          args: {
            token: request.cookies["access-token"],
            application: "api"
          },
          message: "Cоздано устройство"
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