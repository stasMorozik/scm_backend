import { edit } from '../methods/edit';

export class Updating {
  #authorization
  #getterPlaylist
  #contentsTransformer
  #playlistTransformer

  constructor(
    authorization,
    getterPlaylist,
    contentsTransformer,
    playlistTransformer
  ) {
    this.#authorization = authorization
    this.#getterPlaylist = getterPlaylist
    this.#contentsTransformer = contentsTransformer
    this.#playlistTransformer = playlistTransformer
  }

  async update(args = {}) {
    const p_0 = this.#authorization.auth({token: args.token}).then(
      (either) => either.chain(
        (user) => this.#getterPlaylist.get(args.id).then(
          (either) => either.map((entity) => [entity, user])
        )
      )
    )

    const p_1 = p_0.then(
      (either) => either.chain(
        ([entity, user]) => edit(entity, args).map(
          (entity) => [entity, user]
        )
      )
    )

    const p_2 = p_1.then(
      (either) => either.chain(
        ([entity, user]) => this.#contentsTransformer.transform(entity.contents).then(
          (either) => either.map(() => [entity, user])
        )
      )
    )

    return p_2.then(
      (either) => either.chain(
        ([entity, user]) => this.#playlistTransformer.transform(entity, user)
      )
    )
  }
}