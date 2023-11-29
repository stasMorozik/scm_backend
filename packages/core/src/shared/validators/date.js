import { Error } from '../types/error';
import { right, left } from "@sweet-monads/either";

export function valid(date = "") {
  const d = Date.parse(date)

  if (isNaN(d)) {
    return left(new Error("Не валидная дата"))
  }

  return right(new Date(d))
}