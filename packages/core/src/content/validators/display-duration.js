import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";

const minDuration = 10
const maxDuration = 60

export function valid(duration = 0) {
  const d = parseInt(duration)

  if (isNaN(d)) {
    return left(new Error("Не валидное время показа"))
  }

  if (d < minDuration) {
    return left(new Error("Не валидное время показа"))
  }

  if (d > maxDuration) {
    return left(new Error("Не валидное время показа"))
  }

  return right(true)
}