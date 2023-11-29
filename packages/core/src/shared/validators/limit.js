import { Error } from '../types/error';
import { right, left } from "@sweet-monads/either";

const minLimit = 1

export function valid(limit = 10) {
  const l = parseInt(limit)

  if (isNaN(l)) {
    return left(new Error("Не валидные данные для пагинации"))
  }

  if (l < minLimit) {
    return left(new Error("Не валидные данные для пагинации"))
  }

  return right(true)
}