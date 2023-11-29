import { ConfirmationCodeEntity } from 'core';
import { left, right } from "@sweet-monads/either";

export class Updating {
  #client

  constructor(client){
    this.#client = client
  }

  async transform(entity = {}) {
    if ((entity instanceof ConfirmationCodeEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи о коде в БД"))
    }
    
    const query_0 = `
      UPDATE confirmation_codes SET confirmed = true WHERE needle = $1
    `
    await this.#client.query(query_0, [
      entity.needle
    ])

    return right(true)
  }
}