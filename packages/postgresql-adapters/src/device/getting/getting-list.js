import { 
  DeviceEntity, 
  Error,
  FilterDevice,
  SortDevice,
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
    if ((filter instanceof FilterDevice) == false) {
      return left(new Error("Не валидные данные для получения списка устройств"))
    }

    if ((sort instanceof SortDevice) == false) {
      return left(new Error("Не валидные данные для получения списка устройств"))
    }

    if ((pagi instanceof Pagi) == false) {
      return left(new Error("Не валидные данные для получения списка устройств"))
    }

    const query = new QueryBuilder()
                        .whereUserId(filter)
                        .andWhereAddress(filter)
                        .andWhereSshHost(filter)
                        .andWhereIsActive(filter)
                        .andWhereCreatedF(filter)
                        .andWhereCreatedT(filter)
                        .orderByIsActive(sort)
                        .orderByCreated(sort)
                        .limitOffset(pagi)

    const maybeDevices = await this.#client.query(query.string, query.data)

    if (maybeDevices.rowCount == 0) {
      return right([])
    }

    return right(
      maybeDevices.rows.map((row) => {
        return new DeviceEntity(
          row.id,
          null,
          row.ssh_host,
          null,
          null,
          row.address,
          null,
          null,
          row.is_active,
          row.created,
          row.updated
        )
      })
    )
  }
}