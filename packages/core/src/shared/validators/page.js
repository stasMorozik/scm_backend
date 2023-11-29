import { Error } from '../types/error';
import { right, left } from "@sweet-monads/either";

export function valid(page = 1) {
  const p = parseInt(page)

  if (isNaN(p)) {
    return left(new Error("Не валидные данные для пагинации"))
  }

  if (p < 1) {
    return left(new Error("Не валидные данные для пагинации"))
  }

  return right(true)
}