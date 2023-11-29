import { AuthorizationError } from '../types/authorization-error';
import { left } from "@sweet-monads/either";
import jwt from 'jsonwebtoken';

export class Authorization {
  #getterUser
  #secretKey

  constructor(
    getterUser,
    secretKey,
  ) {
    this.#getterUser = getterUser
    this.#secretKey = secretKey
  }

  async auth(args = {}) {
    try {
      const decoded = jwt.verify(args.token, this.#secretKey)

      return this.#getterUser.get(decoded.id)
    } catch(_) {
      return left(new AuthorizationError("Не валидный токен"))
    }
  }
}