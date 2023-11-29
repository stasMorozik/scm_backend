import { right } from "@sweet-monads/either";
import { Sort as SortType } from '../sort';
import { valid } from '../../../shared/validators/sort';

const type = () => {
  return right(new SortType(
    null,
    null
  ))
}

const isActive = (type, isActive) => {
  if (isActive == null || isActive == undefined) {
    return right(type)
  }

  return valid(isActive).map(() => new SortType(
    isActive,
    type.created
  ))
}

const created = (type, created) => {
  if (created == null || created == undefined) {
    return right(type)
  }

  return valid(created).map(() => new SortType(
    type.isActive,
    created
  ))
}

export function build(args = {}) {
  return type().chain(
    (type) => isActive(type, args.isActive)
  ).chain(
    (type) => created(type, args.created)
  )
}