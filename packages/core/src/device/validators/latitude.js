import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";

export function valid(latitude = 0) {
  const l = parseInt(latitude)

  if (isNaN(l)) {
    return left(new Error("Не валидная широта"))
  }

  if (l < -90) {
    return left(new Error("Не валидная широта"))
  }

  if (l > 90) {
    return left(new Error("Не валидная широта"))
  }

  return right(true)
}