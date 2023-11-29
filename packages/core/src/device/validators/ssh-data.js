import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";

const format = /^[a-zA-Z0-9\.\_\-]+$/
const minLength = 3
const maxLength = 15

export function valid(data = "") {
  const d = data.toString().trim()

  if (d.length < minLength) {
    return left(new Error("Не валидные данные ssh соеденения"))
  }

  if (d.length > maxLength) {
    return left(new Error("Не валидные данные ssh соеденения"))
  }

  if (! d.match(format) ) {
    return left(new Error("Не валидные данные ssh соеденения"))
  }
  
  return right(true)
}