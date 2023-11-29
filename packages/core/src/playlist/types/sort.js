
export class Sort {
  #name
  #created

  constructor(
    name,
    created,
  ) {
    this.#name = name
    this.#created = created
  }

  get name() {
    return this.#name
  }

  get created() {
    return this.#created
  }
}