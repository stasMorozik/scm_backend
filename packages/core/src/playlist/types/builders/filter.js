import { right } from "@sweet-monads/either";
import { Filter as FilterType } from '../filter';
import { valid as nameValid } from '../../validators/name';
import { valid as dateValid } from '../../../shared/validators/date';

const type = () => {
  return right(new FilterType(
    null,
    null,
    null,
    null,
  ))
}

const createdF = (type, createdF) => {
  if (createdF == null || createdF == undefined) {
    return right(type)
  }

  return dateValid(createdF).map((date) => new FilterType(
    type.userId,
    type.name,
    date,
    type.createdT
  ))
}

const createdT = (type, createdT) => {
  if (createdT == null || createdT == undefined) {
    return right(type)
  }

  return dateValid(createdT).map((date) => new FilterType(
    type.userId,
    type.name,
    type.createdF,
    date
  ))
}

const name = (type, name) => {
  if (name == null || name == undefined) {
    return right(type)
  }

  return nameValid(name).map(() => new FilterType(
    type.userId,
    name,
    type.createdF,
    type.createdT
  ))
}

export function build(args = {}) {
  return type().chain(
    (type) => createdF(type, args.createdF)
  ).chain(
    (type) => createdT(type, args.createdT)
  ).chain(
    (type) => name(type, args.name)
  )
}