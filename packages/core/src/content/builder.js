import { Entity } from './entity';
import { valid } from './validators/display-duration';
import { build as buildFile } from '../file/builder';
import { right } from "@sweet-monads/either";
import { v4 as uuidv4 } from 'uuid';

const entity = () => {
  return right(new Entity(
    uuidv4(),
    null,
    null,
    new Date(),
    new Date()
  ))
}

const displayDuration = (entity, displayDuration) => {
  return valid(displayDuration).map(() => new Entity(
    entity.id,
    displayDuration,
    null,
    entity.created,
    entity.updated
  ))
}

const file = (entity, file) => {
  return buildFile(file).map((fileEntity) => new Entity(
    entity.id,
    entity.displayDuration,
    fileEntity,
    entity.created,
    entity.updated
  ))
}

export function build(args = {}) {
  return entity().chain(
    (entity) => displayDuration(entity, args.displayDuration)
  ).chain(
    (entity) => file(entity, {...args.file, url: args.url})
  )
}