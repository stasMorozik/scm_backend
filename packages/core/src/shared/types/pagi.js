
export class Pagi {
  #limit
  #page

  constructor(
    limit,
    page
  ){
    this.#limit = limit
    this.#page = page
  }

  get limit() {
    return this.#limit
  }

  get page() {
    return this.#page
  }
}