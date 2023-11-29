import { 
  PlaylistEntity,
  Error,
  FilterPlaylist,
  SortPlaylist,
  Pagi
} from 'core';
import { left, right } from "@sweet-monads/either";
import { QueryBuilder } from './query-builder';

export class GettingList {
  #client

  constructor(client){
    this.#client = client
  }

  async get(filter = {}, sort = {}, pagi = {}) {
    if ((filter instanceof FilterPlaylist) == false) {
      return left(new Error("Не валидные данные для получения списка плэйлистов"))
    }

    if ((sort instanceof SortPlaylist) == false) {
      return left(new Error("Не валидные данные для получения списка плэйлистов"))
    }

    if ((pagi instanceof Pagi) == false) {
      return left(new Error("Не валидные данные для получения списка плэйлистов"))
    }

    const query = new QueryBuilder()
                    .whereUserId(filter)
                    .andWhereName(filter)
                    .andWhereCreatedF(filter)
                    .andWhereCreatedT(filter)
                    .orderByName(sort)
                    .orderByCreated(sort)
                    .limitOffset(pagi)

    const maybePlaylists = await this.#client.query(query.string, query.data) 

    if (maybePlaylists.rowCount == 0) {
      return right([])
    }

    return right(
      maybePlaylists.rows.map((row) => {
        return new PlaylistEntity(
          row.id, 
          row.name, 
          [], 
          new Date(row.created), 
          new Date(row.updated)
        )
      })
    )
  }
}