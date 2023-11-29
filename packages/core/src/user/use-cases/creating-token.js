import { right } from "@sweet-monads/either";
import jwt from 'jsonwebtoken';

export class CreatingToken {
  #authorization
  #secretKey

  constructor(
    authorization,
    secretKey
  ) {
    this.#authorization = authorization
    this.#secretKey = secretKey
  }

  async create(args = {}) {
    return this.#authorization.auth({token: args.token}).then(
      (either) => either.chain((user) => {
        const access = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + 3600,
          id: user.id
        }, this.#secretKey)
  
        const refresh = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + 86400,
          id: user.id
        }, this.#secretKey)
  
        return right({access, refresh})
      })
    )
  }
}