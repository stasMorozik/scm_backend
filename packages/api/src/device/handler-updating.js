import contentTypeParser from 'fast-content-type-parse';
import { UseCaseDeviceUpdating } from 'core';
import { GettingPlaylistById } from 'postgresql-adapters';
import { UpdatingDevice } from 'postgresql-adapters';
import { GettingDeviceById } from 'postgresql-adapters';
import { useCase as authorizationUseCase } from '../user/handler-authorization';
import { info, warning, exception } from '../loggers';
import { notifyDevice } from '../notifiers';
import { postgresPool } from '../postgres-pool';
import { errorHandler } from '../error-handler';

const useCase = new UseCaseDeviceUpdating(
  authorizationUseCase,
  new GettingDeviceById(postgresPool),
  new GettingPlaylistById(postgresPool),
  new UpdatingDevice(postgresPool)
)

export const handlerUpdating = async (request, reply) => {
  try {
    const parsed = contentTypeParser.parse(request.headers['content-type'])

    if (parsed.type != 'application/json') {
      reply
        .code(405)
        .type("application/json")
        .send({message: "Неразрешённый content-type"})
    }

    if (parsed.type == 'application/json') {
      const either = await useCase.update({
        ...request.body,
        token: request.cookies["access-token"],
        id: request.params.id
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
        notifyDevice({
          id: request.params.id
        })
        
        info({
          args: {
            token: request.cookies["access-token"],
            application: "api"
          },
          message: "Обновлено устройство"
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