import { Entity as BaseEntity } from '../shared/entity';

export class Entity extends BaseEntity {
  #name
  #contents

  constructor(id, name, contents, created, updated) {
    super(id, created, updated)
    this.#name = name
    this.#contents = contents
  }

  get name() {
    return this.#name
  }

  get contents() {
    return this.#contents
  }
}