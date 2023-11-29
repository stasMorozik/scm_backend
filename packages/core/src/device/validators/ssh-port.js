import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";

const minPort = 22
const maxPort = 65535

export function valid(port = 0) {
  const p = parseInt(port)

  if (isNaN(p)) {
    return left(new Error("Не валидные данные ssh соеденения"))
  }

  if (p < minPort) {
    return left(new Error("Не валидные данные ssh соеденения"))
  }

  if (p > maxPort) {
    return left(new Error("Не валидные данные ssh соеденения"))
  }

  return right(true)
}