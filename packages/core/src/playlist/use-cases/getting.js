import { valid } from '../../shared/validators/uuid';

export class Getting {
  #authorization
  #getterPlaylist

  constructor(
    authorization,
    getterPlaylist
  ) {
    this.#authorization = authorization
    this.#getterPlaylist = getterPlaylist
  }

  async get(args = {}) {
    const p_0 = valid(args.id).asyncChain(
      () => this.#authorization.auth({token: args.token})
    )

    return p_0.then(
      (e) => e.chain(
        () => this.#getterPlaylist.get(args.id)
      )
    )
  }
}