import { Entity } from "../entity";
import { verify } from './verify';
import { left } from "@sweet-monads/either";

export function confirm(code = 0, entity = {}) {
  if ((entity instanceof Entity) == false) {
    return left(new Error("Не валидные данные для подтверждения"))
  }

  return verify(code, entity).map(() => new Entity(
    entity.needle, 
    entity.created,
    entity.code,
    true
  ))
}