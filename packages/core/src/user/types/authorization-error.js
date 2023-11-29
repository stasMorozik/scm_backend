export class AuthorizationError {
  #message

  constructor(message) {
    this.#message = message
  }

  get message() {
    return this.#message
  }
}