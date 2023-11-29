import { UseCaseDeviceGettingList } from 'core';
import { GettingDeviceList } from 'postgresql-adapters';
import { useCase as authorizationUseCase } from '../user/handler-authorization';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';
import { errorHandler } from '../error-handler';

const useCase = new UseCaseDeviceGettingList(
  authorizationUseCase,
  new GettingDeviceList(postgresPool)
)

export const handlerGettingList = async (request, reply) => {
  try {
    

    const either = await useCase.get({
      token: request.cookies["access-token"],
      pagi: {
        page: request.query.page,
        limit: request.query.limit,
      },
      filter: {
        isActive: (
          isNaN(parseInt(request.query.filterIsActive))
        ) ? undefined : (
          parseInt(request.query.filterIsActive)
        ) ? true : false,
        address: request.query.filterAddress,
        sshHost: request.query.filterSshHost,
        createdF: request.query.filterCreatedF,
        createdT: request.query.filterCreatedT
      },
      sort: {
        isActive: request.query.sortIsActive,
        created: request.query.sortCreated
      }
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

    either.mapRight((list) => {
      info({
        args: {
          token: request.cookies["access-token"],
          application: "api"
        },
        message: "Получен список устройств"
      })

      reply
        .code(200)
        .type("application/json")
        .send(list.map((entity) => {
          return {
            id: entity.id,
            sshHost: entity.sshHost,
            address: entity.address,
            isActive: entity.isActive,
            created: entity.created,
            updated: entity.updated
          }
        }))
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