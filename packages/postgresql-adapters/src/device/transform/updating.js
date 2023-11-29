import { DeviceEntity, PlaylistEntity, Error } from 'core';
import { left, right } from "@sweet-monads/either";

export class Updating {
  #client

  constructor(client){
    this.#client = client
  }

  async transform(entity = {}, playlistEntity = {}, _userEntity = {}) {
    if ((entity instanceof DeviceEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи об устройстве в БД"))
    }

    if ((playlistEntity instanceof PlaylistEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи об устройстве в БД"))
    }

    const query_0 = `
      UPDATE devices
        SET ssh_port = $2, 
        ssh_host = $3, 
        ssh_user = $4, 
        ssh_password = $5, 
        address = $6,
        longitude = $7,
        latitude = $8,
        is_active = $9,
        updated = $10
      WHERE id = $1
    `

    const query_1 = `
     UPDATE relations_playlist_device 
        SET playlist_id = $2
      WHERE device_id = $1
    `

    try {
      await this.#client.query('BEGIN')

      await this.#client.query(query_0, [
        entity.id, entity.sshPort, entity.sshHost,
        entity.sshUser, entity.sshPassword, entity.address,
        entity.longitude, entity.latitude, entity.isActive,
        entity.updated
      ])

      await this.#client.query(query_1, [
        entity.id,
        playlistEntity.id
      ])
      
      await this.#client.query('COMMIT')

      return right(true)
    } catch (e) {
      await this.#client.query('ROLLBACK')

      throw e
    }
  }
}