import { DeviceEntity, Error } from 'core';
import { left, right } from "@sweet-monads/either";

export class GettingById {
  #client

  constructor(client){
    this.#client = client
  }

  async get(id = "") {
    const maybeDevice = await this.#client.query(`
      SELECT * FROM devices WHERE id = $1
    `, [id])

    if (maybeDevice.rowCount == 0) {
      return left(new Error("Устройство не найдено"))
    }

    const [ row ] = maybeDevice.rows

    return right(new DeviceEntity(
      row.id,
      row.ssh_port,
      row.ssh_host,
      row.ssh_user,
      row.ssh_password,
      row.address,
      row.longitude,
      row.latitude,
      row.is_active,
      new Date(row.created),
      new Date(row.updated)
    ))
  }
}