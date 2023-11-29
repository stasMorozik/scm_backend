import { Entity as BaseEntity } from '../shared/entity';

export class Entity extends BaseEntity {
  #displayDuration
  #file

  constructor(id, displayDuration, file, created, updated) {
    super(id, created, updated)
    this.#displayDuration = parseInt(displayDuration)
    this.#file = file
  }

  get displayDuration() {
    return this.#displayDuration
  }

  get file() {
    return this.#file
  }
}