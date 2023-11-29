import { UserEntity, Error } from 'core';
import { left, right } from "@sweet-monads/either";

export class GettingById {
  #client

  constructor(client){
    this.#client = client
  }

  async get(id) {
    const maybeUser = await this.#client.query("SELECT * FROM users WHERE id = $1", [id])

    if (maybeUser.rowCount == 0) {
      return left(new Error("Пользователь не найден"))
    }

    const [ row ] = maybeUser.rows

    return right(new UserEntity(
      row.id,
      row.email,
      row.name,
      row.surname,
      new Date(row.created),
      new Date(row.updated)
    ))
  }
}