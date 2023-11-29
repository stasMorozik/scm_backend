import { Error } from '../types/error';
import { right, left } from "@sweet-monads/either";

export function valid(order = "") {
  const o = order.toString().toUpperCase()

  if (o != "ASC" && o != "DESC") {
    return left(new Error("Не валидный параметр сортировки"))
  }

  return right(true)
}