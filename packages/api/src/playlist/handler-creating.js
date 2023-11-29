import contentTypeParser from 'fast-content-type-parse';
import { UseCasePlaylistCreating } from 'core';
import { InsertingPlaylist } from 'postgresql-adapters';
import { ContentStorageTransformer } from 'http-adapters';
import { useCase as authorizationUseCase } from '../user/handler-authorization';
import { handlerMultipartData } from './handler-multipart-data';
import { info, warning, exception } from '../loggers';
import { postgresPool } from '../postgres-pool';
import { errorHandler } from '../error-handler';

const useCase = new UseCasePlaylistCreating(
  authorizationUseCase,
  new ContentStorageTransformer(
    process.env.WEB_DAV_USER,
    process.env.WEB_DAV_PASSWORD
  ),
  new InsertingPlaylist(postgresPool)
)

export const handlerCreating = async (request, reply) => {
  try {
    const parsed = contentTypeParser.parse(request.headers['content-type'])

    if (parsed.type != 'multipart/form-data') {
      reply
        .code(405)
        .type("application/json")
        .send({message: "Неразрешённый content-type"})
    }

    if (parsed.type == 'multipart/form-data') {
      const [contents, _, name] = await handlerMultipartData(request)

      const either = await useCase.create({
        name: name,
        token: request.cookies["access-token"],
        url: process.env.WEB_DAV_URL,
        contents: Object.values(contents)
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
          message: "Создан плэйлист"
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