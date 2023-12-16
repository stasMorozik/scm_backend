import { Entity } from './entity';
import { build as buildContent } from '../content/builder';
import { valid } from './validators/name';
import { Error } from '../shared/types/error';
import { right, left } from "@sweet-monads/either";
import { v4 as uuidv4 } from 'uuid';

const entity = () => {
  return right(new Entity(
    uuidv4(),
    null,
    [],
    new Date(),
    new Date()
  ))
}

const name = (entity, name) => {
  return valid(name).map(() => new Entity(
    entity.id,
    name,
    entity.contents,
    entity.created,
    entity.updated
  ))
}

const contents = (entity, contents, url) => {
  if (!Array.isArray(contents)) {
    return left(new Error("Пустой список контента"))
  }

  if (contents.length == 0) {
    return left(new Error("Пустой список контента"))
  }

  const cnts = contents.map((c) => buildContent({...c, url }))

  const leftEither = cnts.find((either) => either.isLeft())
  
  if (leftEither) {
    return leftEither
  }

  return right(new Entity(
    entity.id,
    entity.name,
    cnts.map((either) => either.value),
    entity.created,
    entity.updated
  ))
}

export function build(args = {}) {
  return entity().chain(
    (entity) => name(entity, args.name)
  ).chain(
    (entity) => contents(entity, args.contents, args.url)
  )
}