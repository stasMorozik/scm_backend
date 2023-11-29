import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";
import { Entity } from '../entity';

export function verify(code = 0, entity = {}) {
  if ((entity instanceof Entity) == false) {
    return left(new Error("Не валидные данные для верификации"))
  }

  if ( (Math.floor(Date.now() / 1000)) > entity.created ) {
    return left(new Error("Истекло время жизни"))
  }

  if (code != entity.code) {
    return left(new Error("Не верный код подтверждения"))
  }

  return right(true)
}