import { PlaylistEntity, FileEntity, ContentEntity, Error } from 'core';
import { left, right } from "@sweet-monads/either";

export class GettingById {
  #client

  constructor(client){
    this.#client = client
  }

  async get(id = "") {
    const maybePlaylist = await this.#client.query(`
      SELECT * FROM playlists WHERE id = $1
    `, [id])

    if (maybePlaylist.rowCount == 0) {
      return left(new Error("Плэйлист не найден не найден"))
    }

    const [ row ] = maybePlaylist.rows

    return right(new PlaylistEntity(
      row.id, 
      row.name, 
      row.contents.map((c) => {
        return new ContentEntity(
          c.id, 
          c.display_duration, 
          new FileEntity(
            c.file.id, 
            c.file.size, 
            c.file.url, 
            c.file.path, 
            new Date(c.file.created), 
            new Date(c.file.updated)
          ), 
          new Date(c.created), 
          new Date(c.updated)
        )
      }), 
      new Date(row.created), 
      new Date(row.updated)
    ))
  }
}