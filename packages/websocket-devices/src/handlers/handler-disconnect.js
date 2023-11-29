import { info, exception } from '../loggers';
import { useCaseUpdatingDevice } from '../use-cases/use-case-device-updating';
import { useCaseGettingPlaylist } from '../use-cases/use-case-playlist-getting';
import { notifyAdmin } from '../notifiers';

export const handlerDisconnect = async (request) => {
  try {
    const either_0 = await useCaseGettingPlaylist.get({
      id: request.params.id,
      token: request.query.token
    })

    either_0.mapLeft((error) => {
      exception({
        args: {
          token: request.query.token,
          application: "websocket-devices"
        },
        message: `
          Устройство отсоединилось, но не обновлен его статус активности, ${error.message}
        `
      })
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
        isActive: false,
        token: request.query.token,
        id: request.params.id,
        playlistId: entity.id
      })
    })

    either_1.mapLeft((error) => {
      exception({
        args: {
          token: request.query.token,
          application: "websocket-devices"
        },
        message: `
          Устройство отсоединилось, но не обновлен его статус активности, ${error.message}
        `
      })
    })

    either_1.mapRight(() => {
      notifyAdmin({
        id: request.params.id,
        isActive: false
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
      message: `
        Устройство отсоединилось, но не обновлен его статус активности, ${e.message}
      `
    })

    reply
      .code(500)
      .type("application/json")
      .send({message: "Что то пошло не так"})
  }
}