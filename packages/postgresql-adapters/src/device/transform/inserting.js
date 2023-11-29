import { DeviceEntity, PlaylistEntity, UserEntity, Error } from 'core';
import { left, right } from "@sweet-monads/either";

export class Inserting {
  #client

  constructor(client){
    this.#client = client
  }

  async transform(entity = {}, playlistEntity = {}, userEntity = {}) {
    if ((entity instanceof DeviceEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи об устройстве в БД"))
    }

    if ((playlistEntity instanceof PlaylistEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи об устройстве в БД"))
    }

    if ((userEntity instanceof UserEntity) == false) {
      return left(new Error("Не валидные данные для занесения записи об устройстве в БД"))
    }

    const query_0 = `
      INSERT INTO devices (
        id,
        ssh_port,
        ssh_host,
        ssh_user,
        ssh_password,
        address,
        longitude,
        latitude,
        is_active,
        created,
        updated
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
    `

    const query_1 = `
      INSERT INTO relations_user_device (
        user_id,
        device_id
      ) VALUES (
        $1, $2
      )
    `

    const query_2 = `
      INSERT INTO relations_playlist_device (
        playlist_id,
        device_id
      ) VALUES (
        $1, $2
      )
    `
    
    try {
      await this.#client.query('BEGIN')

      await this.#client.query(query_0, [
        entity.id, entity.sshPort, entity.sshHost,
        entity.sshUser, entity.sshPassword, entity.address,
        entity.longitude, entity.latitude, entity.isActive,
        entity.created, entity.updated
      ])

      await this.#client.query(query_1, [
        userEntity.id,
        entity.id
      ])

      await this.#client.query(query_2, [
        playlistEntity.id,
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