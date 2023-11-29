import { build } from '../builder';

export class Creating {
  #authorization
  #getterPlaylist
  #transformer

  constructor(
    authorization,
    getterPlaylist,
    transformer
  ) {
    this.#authorization = authorization
    this.#getterPlaylist = getterPlaylist
    this.#transformer = transformer
  }

  async create(args = {}) {
    const p_0 = this.#authorization.auth({token: args.token})

    const p_1 = p_0.then(
      (either) => either.chain(
        (user) => this.#getterPlaylist.get(args.playlistId).then(
          (either) => either.map((playlist) => [user, playlist])
        )
      )
    )

    return p_1.then(
      (either) => either.chain(
        ([user, playlist]) => build(args).chain(
          (entity) => this.#transformer.transform(entity, playlist, user)
        )
      )
    )
  }
}