import { UseCasePlaylistGetting } from 'core';
import { GettingPlaylistByDeviceId } from 'postgresql-adapters';
import { useCase as authorizationUseCase } from '../user/handler-authorization';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';
import { errorHandler } from '../error-handler';

const useCase = new UseCasePlaylistGetting(
  authorizationUseCase,
  new GettingPlaylistByDeviceId(postgresPool)
)

export const handlerGettingByDeviceId = async (request, reply) => {
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
        message: "Получен плэйлист"
      })

      reply
        .code(200)
        .type("application/json")
        .send({
          id: entity.id,
          name: entity.name,
          created: entity.created,
          updated: entity.updated,
          contents: entity.contents.map((content) => {
            return {
              id: content.id,
              displayDuration: content.displayDuration,
              file: {
                id: content.file.id,
                url: content.file.url,
                created: content.file.created,
                updated: content.file.updated
              },
              created: content.created,
              updated: content.updated
            }
          })
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