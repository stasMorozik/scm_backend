import { Entity as BaseEntity } from '../shared/entity';

export class Entity extends BaseEntity {
  #email
  #name
  #surname

  constructor(id, email, name, surname, created, updated) {
    super(id, created, updated)
    this.#email = email
    this.#name = name
    this.#surname = surname
  }

  get email() {
    return this.#email
  }

  get name() {
    return this.#name
  }

  get surname() {
    return this.#surname
  }
}