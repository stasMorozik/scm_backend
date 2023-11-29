
export class Entity {
  #id
  #created
  #updated

  constructor(id, created, updated) {
    this.#id = id
    this.#created = created
    this.#updated = updated
  }

  get id() {
    return this.#id
  }

  get created() {
    return this.#created
  }

  get updated() {
    return this.#updated
  }
}