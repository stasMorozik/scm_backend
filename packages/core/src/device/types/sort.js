
export class Sort {
  #isActive
  #created

  constructor(
    isActive,
    created,
  ) {
    this.#isActive = isActive
    this.#created = created
  }

  get isActive() {
    return this.#isActive
  }

  get created() {
    return this.#created
  }
}