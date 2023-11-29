import { Entity as BaseEntity } from '../shared/entity';

export class Entity extends BaseEntity {
  #size
  #url
  #path

  constructor(id, size, url, path, created, updated) {
    super(id, created, updated)
    this.#size = size
    this.#url = url
    this.#path = path
  }

  get size() {
    return this.#size
  }

  get url() {
    return this.#url
  }

  get path() {
    return this.#path
  }
}