import { useCaseDeviceGettingList } from '../use-cases/use-case-device-getting-list';
import { exception, info, warning } from '../loggers';
import { notifyDevice } from '../notifiers';

export const updatingPlaylistHandler = async (args = {}) => {
  try {
    const either = await useCaseDeviceGettingList.get({
      token: args.token,
      filter: {
        playlistId: args.id
      },
      sort: {
        
      },
      pagi: {
        page: 1,
        limit: 10
      }
    })

    either.mapLeft((error) => {
      warning({
        args: {
          token: args.token,
          application: "devices-notifier-service"
        },
        message: error.message
      })
    })

    either.mapRight((list) => {
      info({
        args: {
          token: args.token,
          application: "devices-notifier-service"
        },
        message: "Получен список устройств"
      })

      list.forEach((entity) => {
        notifyDevice({
          id: entity.id
        })
      })
    })
  } catch(e) {
    exception({
      args: {
        token: args.token,
        application: "devices-notifier-service"
      },
      message: e.message
    })
  }
}