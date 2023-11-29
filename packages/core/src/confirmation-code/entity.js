
export class Entity {
  #needle
  #created
  #code
  #confirmed

  constructor(needle, created, code, confirmed) {
    this.#needle = needle
    this.#created = created
    this.#code = code
    this.#confirmed = confirmed
  }

  get needle() {
    return this.#needle
  }

  get created() {
    return this.#created
  }

  get code() {
    return this.#code
  }

  get confirmed() {
    return this.#confirmed
  }
}