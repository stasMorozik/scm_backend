import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";

export function valid(longitude = 0) {
  const l = parseInt(longitude)

  if (isNaN(l)) {
    return left(new Error("Не валидная долгота"))
  }

  if (l < -180) {
    return left(new Error("Не валидная долгота"))
  }

  if (l > 180) {
    return left(new Error("Не валидная долгота"))
  }

  return right(true)
}