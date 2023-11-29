import { build } from '../builder';

export class Creating {
  #authorization
  #contentsTransformer
  #playlistTransformer

  constructor(
    authorization,
    contentsTransformer,
    playlistTransformer
  ) {
    this.#authorization = authorization
    this.#contentsTransformer = contentsTransformer
    this.#playlistTransformer = playlistTransformer
  }

  async create(args = {}) {
    const p_0 = this.#authorization.auth({token: args.token}).then(
      (either) => either.chain(
        (user) => build(args).map((entity) => [entity, user])
      )
    )

    const p_1 = p_0.then(
      (either) => either.chain(
        ([entity, user]) => this.#contentsTransformer.transform(entity.contents).then(
          (either) => either.map(() => [entity, user])
        )
      )
    )

    return p_1.then(
      (either) => either.chain(
        ([entity, user]) => this.#playlistTransformer.transform(entity, user)
      )
    )
  }
}