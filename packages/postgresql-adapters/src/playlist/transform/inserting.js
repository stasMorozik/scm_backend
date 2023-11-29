import { PlaylistEntity, UserEntity, Error } from 'core';
import { left, right } from "@sweet-monads/either";
import { jsonStringifyContent } from './json-stringify-content';

export class Inserting {
  #client

  constructor(client){
    this.#client = client
  }

  async transform(entity = {}, userEntity = {}) {
    if ((entity instanceof PlaylistEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи о плэйлисте в БД"))
    }

    if ((userEntity instanceof UserEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи о плэйлисте в БД"))
    }

    const query_0 = `
      INSERT INTO playlists (
        id,
        name,
        contents,
        created,
        updated
      ) VALUES(
        $1, $2, $3, $4, $5
      )
    `

    const query_1 = `
      INSERT INTO relations_user_playlist (
        user_id,
        playlist_id
      ) VALUES(
        $1, $2
      )
    `

    try {

      await this.#client.query(query_0, [
        entity.id,
        entity.name,
        jsonStringifyContent(entity.contents),
        entity.created,
        entity.updated,
      ])

      await this.#client.query(query_1, [
        userEntity.id,
        entity.id
      ])
      
      await this.#client.query('COMMIT')

      return right(true)

    } catch (e) {
      await this.#client.query('ROLLBACK')

      throw e
    }
  }
}