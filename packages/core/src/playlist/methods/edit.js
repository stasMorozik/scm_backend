import { Error } from '../../shared/types/error';
import { valid } from '../validators/name';
import { build as buildContent } from '../../content/builder';
import { right, left } from "@sweet-monads/either";
import { Entity } from '../entity';

const updated = (entity) => {
  return right(new Entity(
    entity.id,
    entity.name,
    entity.contents,
    entity.created,
    new Date()
  ))
}

const name = (entity, name) => {
  if (name == null || name == undefined) {
    return right(entity)
  }

  return valid(name).map(() => new Entity(
    entity.id,
    name,
    entity.contents,
    entity.created,
    entity.updated
  ))
}

const delContents = (entity, object) => {
  if (typeof object != "object") {
    return left(new Error("Не валидные данные для редактирования плэйлиста"))
  }

  const contents = entity.contents.filter(
    (c) => !object[c.id]
  )

  return right(new Entity(
    entity.id,
    entity.name,
    contents,
    entity.created,
    entity.updated
  ))
}

const putContents = (entity, contents, url) => {
  if (!Array.isArray(contents)) {
    return right(entity)
  }

  if (contents.length == 0) {
    return right(entity)
  }

  const cnts = contents.map((c) => buildContent({...c, url }))

  const leftEither = cnts.find((either) => either.isLeft())
  
  if (leftEither) {
    return leftEither
  }

  return right(new Entity(
    entity.id,
    entity.name,
    [...entity.contents, ...cnts.map((either) => either.value)],
    entity.created,
    entity.updated
  ))
}

export function edit(entity = {}, args = {}) {
  if ((entity instanceof Entity) == false) {
    return left(new Error("Не валидные данные для удаления контента"))
  }

  return updated(entity).chain(
    (entity) => name(entity, args.name)
  ).chain(
    (entity) => delContents(entity, args.deleteContents)
  ).chain(
    (entity) => putContents(entity, args.contents, args.url)
  )
}