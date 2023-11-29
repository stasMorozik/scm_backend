
export class Filter {
  #userId  
  #name
  #createdF  
  #createdT
  
  constructor(
    userId,
    name,  
    createdF,  
    createdT
  ) {
    this.#userId = userId
    this.#name = name
    this.#createdF = createdF
    this.#createdT = createdT
  }

  get userId() {
    return this.#userId
  }

  get name() {
    return this.#name
  }

  get createdF() {
    return this.#createdF
  }

  get createdT() {
    return this.#createdT
  }
}