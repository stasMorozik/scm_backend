import { ConfirmationCodeEntity } from 'core';
import { left, right } from "@sweet-monads/either";

export class Getting {
  #client

  constructor(client){
    this.#client = client
  }

  async get(needle) {
    const query_0 = "SELECT * FROM confirmation_codes WHERE needle = $1"

    const maybeCode = await this.#client.query(query_0, [needle])

    if (maybeCode.rowCount == 0) {
      return left(new Error("Код подтверждения не найден"))
    }

    const [ row ] = maybeCode.rows

    return right(new ConfirmationCodeEntity(
      row.needle,
      parseInt(row.created),
      parseInt(row.code),
      row.confirmed
    ))
  }
}