import { Error } from '../../shared/types/error';
import { right, left } from "@sweet-monads/either";

const minLength = 3
const maxLength = 64

export function valid(name = "") {
  const n = name.toString().trim()

  if (n.length < minLength) {
    return left(new Error("Не валидное название плэйлиста"))
  }

  if (n.length > maxLength) {
    return left(new Error("Не валидное название плэйлиста"))
  }

  return right(true)
}