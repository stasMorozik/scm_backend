import { AuthorizationError } from '../types/authorization-error';
import { left, right } from "@sweet-monads/either";
import jwt from 'jsonwebtoken';

export class RefreshingToken {
  #secretKey

  constructor(
    secretKey
  ) {
    this.#secretKey = secretKey
  }

  async refresh(args = {}) {
    try {
      const decoded = jwt.verify(args.token, this.#secretKey)

      const access = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 3600,
        id: decoded.id
      }, this.#secretKey)

      const refresh = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 86400,
        id: decoded.id
      }, this.#secretKey)

      return right({access, refresh}) 
    } catch(_) {
      return left(new AuthorizationError("Не валидный токен"))
    }
  }
}