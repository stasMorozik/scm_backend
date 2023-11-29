import { Entity } from './entity';
import { right } from "@sweet-monads/either";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { valid } from './validators/file';

const entity = () => {
  return right(new Entity(
    uuidv4(),
    null,
    null,
    null,
    new Date(),
    new Date()
  ))
}

const file = (entity, path) => {
  return valid(path).map((stat) => new Entity(
    entity.id,
    stat.size,
    null,
    path,
    entity.created,
    entity.updated
  ))
}

const url = (entity, url) => {
  return right(new Entity(
    entity.id,
    entity.size,
    `${url}/${entity.id}/${path.basename(entity.path)}`,
    entity.path,
    entity.created,
    entity.updated
  ))
}

export function build(args = {}) {
  return entity().chain(
    (entity) => file(entity, args.path)
  ).chain(
    (entity) => url(entity, args.url)
  )
}