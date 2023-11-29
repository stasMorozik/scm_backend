import { edit } from '../methods/edit';

export class Updating {
  #authorization
  #getterDevice
  #getterPlaylist
  #transformer

  constructor(
    authorization,
    getterDevice,
    getterPlaylist,
    transformer
  ) {
    this.#authorization = authorization
    this.#getterDevice = getterDevice
    this.#getterPlaylist = getterPlaylist
    this.#transformer = transformer
  }

  async update(args = {}) {
    const p_0 = this.#authorization.auth({token: args.token})

    const p_1 = p_0.then(
      (either) => either.chain(
        (user) => this.#getterPlaylist.get(args.playlistId).then(
          (either) => either.map((playlist) => [user, playlist])
        )
      )
    )

    const p_2 = p_1.then(
      (either) => either.chain(
        ([user, playlist]) => this.#getterDevice.get(args.id).then(
          (either) => either.map((device) => [user, playlist, device])
        )
      )
    )

    return p_2.then(
      (either) => either.chain(
        ([user, playlist, device]) => edit(device, args).chain(
          (entity) => this.#transformer.transform(entity, playlist, user)
        )
      )
    )
  }
}