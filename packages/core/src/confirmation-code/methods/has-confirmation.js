import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";
import { Entity } from '../entity';

export function hasConfirmation(entity = {}) {
  if ((entity instanceof Entity) == false) {
    return left(new Error("Не валидные данные для проверки подтверждения"))
  }

  if (entity.confirmed) {
    return right(true)
  }

  return left(new Error(`${entity.needle} не подтверждён`))
}