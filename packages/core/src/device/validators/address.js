import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";

const minLength = 10
const maxLength = 256

export function valid(data = "") {
  const d = data.toString().trim()

  if (d.length < minLength) {
    return left(new Error("Не валидный адрес"))
  }

  if (d.length > maxLength) {
    return left(new Error("Не валидный адрес"))
  }
  
  return right(true)
}