import { valid } from '../../shared/validators/uuid';

export class Getting {
  #authorization
  #getterDevice

  constructor(
    authorization,
    getterDevice
  ) {
    this.#authorization = authorization
    this.#getterDevice = getterDevice
  }

  async get(args = {}) {
    const p_0 = valid(args.id).asyncChain(
      () => this.#authorization.auth({token: args.token})
    )

    return p_0.then(
      (e) => e.chain(
        () => this.#getterDevice.get(args.id)
      )
    )
  }
}