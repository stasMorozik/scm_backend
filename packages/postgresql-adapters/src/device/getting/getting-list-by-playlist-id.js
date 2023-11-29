import { 
  DeviceEntity, 
  Error,
  FilterDevice
} from 'core';
import { left, right } from "@sweet-monads/either";

export class GettingListByPlaylistId {
  #client

  constructor(client){
    this.#client = client
  }

  async get(filter = {}, _sort = {}, _pagi = {}) {
    if ((filter instanceof FilterDevice) == false) {
      return left(new Error("Не валидные данные для получения списка устройств"))
    }

    const query = `
      SELECT 
        d.id, d.address, d.ssh_host, d.is_active, d.created, d.updated
      FROM 
        relations_user_device AS rl_u_d
      JOIN 
        devices AS d ON d.id = rl_u_d.device_id
      JOIN 
        relations_playlist_device AS rl_pl_d ON rl_pl_d.device_id = d.id
      WHERE rl_u_d.user_id = $1 AND rl_pl_d.playlist_id = $2
    `

    const maybeDevices = await this.#client.query(query, [filter.userId, filter.playlistId])

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