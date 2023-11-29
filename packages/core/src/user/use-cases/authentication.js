import { valid } from '../../shared/validators/email';
import { hasConfirmation } from '../../confirmation-code/methods/has-confirmation';
import { right } from "@sweet-monads/either";
import jwt from 'jsonwebtoken';

export class Authentication {
  #getterUser
  #getterCode
  #secretKey

  constructor(
    getterUser,
    getterCode,
    secretKey,
  ) {
    this.#getterUser = getterUser
    this.#getterCode = getterCode
    this.#secretKey = secretKey
  }

  async auth(args = {}) {
    const p_0 = valid(args.email).asyncChain(
      () => this.#getterCode.get(args.email)
    )
    
    const p_1 = p_0.then(
      (e) => e.chain(
        (entity) => hasConfirmation(entity)
      ).asyncChain(
        () => this.#getterUser.get(args.email)
      )
    )

    return p_1.then((e) => 
      e.chain((user) => {
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