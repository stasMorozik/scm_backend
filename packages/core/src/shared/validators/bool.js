import { Error } from '../types/error';
import { right, left } from "@sweet-monads/either";

export function valid(bool = false) {
  if (typeof bool != "boolean" ) {
    return left(new Error("Не валидное булево значение"))
  }

  return right(true)
}