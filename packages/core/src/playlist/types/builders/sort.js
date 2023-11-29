import { right } from "@sweet-monads/either";
import { Sort as SortType } from '../sort';
import { valid } from '../../../shared/validators/sort';

const type = () => {
  return right(new SortType(
    null,
    null
  ))
}

const name = (type, name) => {
  if (name == null || name == undefined) {
    return right(type)
  }

  return valid(name).map(() => new SortType(
    name,
    type.created
  ))
}

const created = (type, created) => {
  if (created == null || created == undefined) {
    return right(type)
  }

  return valid(created).map(() => new SortType(
    type.name,
    created
  ))
}

export function build(args = {}) {
  return type().chain(
    (type) => name(type, args.name)
  ).chain(
    (type) => created(type, args.created)
  )
}