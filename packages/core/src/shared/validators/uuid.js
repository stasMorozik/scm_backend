import { validate } from 'uuid';
import { Error } from '../types/error';
import { right, left } from "@sweet-monads/either";

export function valid(uuid = "") {
  if (! validate(uuid) ) {
    return left(new Error("Не валидный uuid"))
  }

  return right(true)
}