import contentTypeParser from 'fast-content-type-parse';
import { UseCasePlaylistUpdating } from 'core';
import { GettingPlaylistById } from 'postgresql-adapters';
import { UpdatingPlaylist } from 'postgresql-adapters';
import { ContentStorageTransformer } from 'http-adapters';
import { useCase as authorizationUseCase } from '../user/handler-authorization';
import { handlerMultipartData } from './handler-multipart-data';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';
import { errorHandler } from '../error-handler';
import { notifyService } from '../notifiers';

const useCase = new UseCasePlaylistUpdating(
  authorizationUseCase,
  new GettingPlaylistById(postgresPool),
  new ContentStorageTransformer(
    process.env.WEB_DAV_USER,
    process.env.WEB_DAV_PASSWORD
  ),
  new UpdatingPlaylist(postgresPool)
)

export const handlerUpdating = async (request, reply) => {
  try {
    const parsed = contentTypeParser.parse(request.headers['content-type'])

    if (parsed.type != 'multipart/form-data') {
      reply
        .code(405)
        .type("application/json")
        .send({message: "Неразрешённый content-type"})
    }

    if (parsed.type == 'multipart/form-data') {
      const [ contents, deleteContents, name ] = await handlerMultipartData(request)

      const either = await useCase.update({
        name: name,
        token: request.cookies["access-token"],
        url: process.env.WEB_DAV_URL,
        contents: Object.values(contents),
        deleteContents: deleteContents,
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
        notifyService({
          id: request.params.id,
          token: request.cookies["access-token"]
        })
        
        info({
          args: {
            token: request.cookies["access-token"],
            application: "api"
          },
          message: "Обновлен плэйлист"
        })
  
        reply
          .code(200)
          .type("application/json")
          .send(true)
      })
    }
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