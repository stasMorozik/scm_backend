import { PlaylistEntity, Error } from 'core';
import { left, right } from "@sweet-monads/either";
import { jsonStringifyContent } from './json-stringify-content';

export class Updating {
  #client

  constructor(client){
    this.#client = client
  }

  async transform(entity = {}, _userEntity = null) {
    if ((entity instanceof PlaylistEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи о плэйлисте в БД"))
    }

    const query_0 = `
      UPDATE playlists
        SET name = $2, contents = $3, updated = $4
      WHERE id = $1
    `

    await this.#client.query(query_0, [
      entity.id,
      entity.name,
      jsonStringifyContent(entity.contents),
      entity.updated,
    ])

    return right(true)
  }
}