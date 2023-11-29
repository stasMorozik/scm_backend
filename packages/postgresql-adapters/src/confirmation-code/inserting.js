import { ConfirmationCodeEntity } from 'core';
import { left, right } from "@sweet-monads/either";

export class Inserting {
  #client

  constructor(client){
    this.#client = client
  }

  async transform(entity = {}) {
    if ((entity instanceof ConfirmationCodeEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи о коде в БД"))
    }

    const query_0 = `
      DELETE FROM confirmation_codes WHERE needle = $1
    `

    const query_1 = `
      INSERT INTO confirmation_codes (
        needle, code, confirmed, created
      ) VALUES(
        $1, $2, $3, $4
      )
    `

    try {
      await this.#client.query('BEGIN')

      await this.#client.query(query_0, [
        entity.needle
      ])

      await this.#client.query(query_1, [
        entity.needle, entity.code, entity.confirmed, entity.created
      ])
      
      await this.#client.query('COMMIT')

      return right(true)
    } catch (e) {
      await this.#client.query('ROLLBACK')

      throw e
    }
  }
}