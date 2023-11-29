import { valid as pageValid } from '../../validators/page';
import { valid as limitValid } from '../../validators/limit';
import { Pagi as PagiType } from '../pagi';
import { right } from "@sweet-monads/either";

const type = () => {
  return right(new PagiType(
    null,
    null
  ))
}

const limit = (type, limit) => {
  return limitValid(limit).map(() => new PagiType(
    limit,
    type.page
  ))
}

const page = (type, page) => {
  return pageValid(page).map(() => new PagiType(
    type.limit,
    page
  ))
}

export function build(args = {}) {
  return type().chain(
    (entity) => limit(entity, args.limit)
  ).chain(
    (entity) => page(entity, args.page)
  )
}