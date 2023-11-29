import { info, warning, exception } from '../loggers';
import { errorHandler } from '../error-handler';
import { useCaseUpdatingDevice } from '../use-cases/use-case-device-updating';
import { useCaseGettingPlaylist } from '../use-cases/use-case-playlist-getting';
import { notifyAdmin } from '../notifiers';

export const handlerConnect = async (request, reply) => {
  try {
    const either_0 = await useCaseGettingPlaylist.get({
      id: request.params.id,
      token: request.query.token
    })

    either_0.mapLeft((error) => {
      warning({
        args: {
          token: request.query.token,
          application: "websocket-devices"
        },
        message: error.message
      })

      errorHandler(error, reply)
    })
    
    const either_1 = await either_0.chain(async (entity) => {
      info({
        args: {
          token: request.query.token,
          application: "websocket-devices"
        },
        message: "Получен плэйлист"
      })

      return await useCaseUpdatingDevice.update({
        isActive: true,
        token: request.query.token,
        id: request.params.id,
        playlistId: entity.id
      })
    })

    either_1.mapLeft((error) => {
      warning({
        args: {
          token: request.query.token,
          application: "websocket-devices"
        },
        message: error.message
      })

      errorHandler(error, reply)
    })

    either_1.mapRight(() => {
      notifyAdmin({
        id: request.params.id,
        isActive: true
      })
      
      info({
        args: {
          token: request.query.token,
          application: "websocket-devices"
        },
        message: "Обновлено устройство"
      })
    })
  } catch (e) {
    exception({
      args: {
        token: request.query.token,
        application: "websocket-devices"
      },
      message: e.message
    })

    reply
      .code(500)
      .type("application/json")
      .send({message: "Что то пошло не так"})
  }
}