import { UserEntity, Error } from 'core';
import { left, right } from "@sweet-monads/either";

export class GettingByEmail {
  #client

  constructor(client){
    this.#client = client
  }

  async get(email) {
    const maybeUser = await this.#client.query("SELECT * FROM users WHERE email = $1", [email])

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