import { Error } from '../types/error';
import { right, left } from "@sweet-monads/either";

const format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export function valid(email = "") {
  const e = email.toString().trim()

  if (! e.match(format) ) {
    return left(new Error("Не валидный адрес электронной почты"))
  }

  return right(true)
}