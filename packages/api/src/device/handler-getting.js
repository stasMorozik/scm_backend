import { UseCaseDeviceGetting } from 'core';
import { GettingDeviceById } from 'postgresql-adapters';
import { useCase as authorizationUseCase } from '../user/handler-authorization';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';
import { errorHandler } from '../error-handler';

const useCase = new UseCaseDeviceGetting(
  authorizationUseCase,
  new GettingDeviceById(postgresPool)
)

export const handlerGetting = async (request, reply) => {
  try {
    const either = await useCase.get({
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

    either.mapRight((entity) => {
      info({
        args: {
          token: request.cookies["access-token"],
          application: "api"
        },
        message: "Получено устройство"
      })

      reply
        .code(200)
        .type("application/json")
        .send({
          id: entity.id,
          sshPort: entity.sshPort,
          sshHost: entity.sshHost,
          sshUser: entity.sshUser,
          sshPassword: entity.sshPassword,
          address: entity.address,
          longitude: entity.longitude,
          latitude: entity.latitude,
          isActive: entity.isActive,
          created: entity.created,
          updated: entity.updated
        })
    })
  } catch (e) {
    console.log(e)
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