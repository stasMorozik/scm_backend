import { Entity } from './entity';
import { valid } from '../shared/validators/email';
import { right } from "@sweet-monads/either";

const entity = () => {
  return right(new Entity(
    null, 
    Math.floor(Date.now() / 1000) + 86400,
    Math.floor(Math.random() * (9999 - 1000) + 1000),
    false
  ))
}

const needle = (entity, validator, needle) => {
  return validator(needle).map(() => new Entity(
    needle, 
    entity.created,
    entity.code,
    entity.confirmed
  ))
}

export function build(args = {}) {
  return entity().chain(
    (entity) => needle(entity, valid, args.needle)
  )
}