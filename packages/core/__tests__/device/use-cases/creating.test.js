import test from 'node:test';
import assert from 'node:assert';
import { UserEntity } from '../../../lib/index.t.mjs';
import { PlaylistEntity } from '../../../lib/index.t.mjs';
import { ContentEntity } from '../../../lib/index.t.mjs';
import { FileEntity } from '../../../lib/index.t.mjs';
import { DeviceEntity } from '../../../lib/index.t.mjs';
import { UseCaseAuthorization } from '../../../lib/index.t.mjs';
import { UseCaseDeviceCreating } from '../../../lib/index.t.mjs';
import { right, left } from "@sweet-monads/either";
import jwt from 'jsonwebtoken';

let users = {}
let playlists = {}
let devices = {}

const transformerUser = {
  async transform(entity = {}) {
    if ((entity instanceof UserEntity) == false) {
      return left(new Error("Не валидные данные"))
    }

    users[entity.id] = entity

    return right(true)
  }
}

const getterUser = {
  async get(id ="") {
    const maybeEntity = users[id]

    if(!maybeEntity) {
      return left(new Error("Пользователь найден"))
    }

    return right(maybeEntity)
  }
}

const transformerPlaylist = {
  async transform(entity = {}, userEntity = {}) {
    if ((entity instanceof PlaylistEntity) == false) {
      return left(new Error("Не валидные данные"))
    }

    if ((userEntity instanceof UserEntity) == false) {
      return left(new Error("Не валидные данные"))
    }

    playlists[entity.id] = entity

    return right(true)
  }
}

const getterPlaylist = {
  async get(id ="") {
    const maybeEntity = playlists[id]

    if(!maybeEntity) {
      return left(new Error("Плэйлист найден"))
    }

    return right(maybeEntity)
  }
}

const transformerDevice = {
  async transform(entity = {}, playlistEntity = {}, userEntity = {}) {
    if ((entity instanceof DeviceEntity) == false) {
      return left(new Error("Не валидные данные"))
    }

    if ((playlistEntity instanceof PlaylistEntity) == false) {
      return left(new Error("Не валидные данные"))
    }

    if ((userEntity instanceof UserEntity) == false) {
      return left(new Error("Не валидные данные"))
    }

    devices[entity.id] = entity

    return right(true)
  }
}

const authorizationUseCase = new UseCaseAuthorization(getterUser, "some_secret_key")
const u = new UseCaseDeviceCreating(authorizationUseCase, getterPlaylist, transformerDevice)

test('Create device', async () => {
  const user = new UserEntity(
    "some_id",
    "test@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  transformerUser.transform(user)

  const access = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 3600,
    id: user.id
  }, "some_secret_key")

  const playlist = new PlaylistEntity(
    "some_id_1",
    "some_name",
    [
      new ContentEntity(
        "some_id_2",
        15,
        new FileEntity(
          "some_id_3",
          1214214,
          "http://localhost/1.jpg",
          "/tmp/1.jpg",
          new Date(),
          new Date()
        ),
        new Date(),
        new Date()
      )
    ],
    new Date(),
    new Date()
  )

  transformerPlaylist.transform(playlist, user)

  const either_2 = await u.create({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647,
    playlistId: "some_id_1",
    token: access
  })

  assert.strictEqual(either_2.isRight(), true)
})

test('Playlist not found', async () => {
  const user = new UserEntity(
    "some_id",
    "test@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  transformerUser.transform(user)

  const access = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 3600,
    id: user.id
  }, "some_secret_key")

  const either_2 = await u.create({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647,
    playlistId: "some_id_6",
    token: access
  })

  assert.strictEqual(either_2.isLeft(), true)
})

test('Invalid token', async () => {
  const user = new UserEntity(
    "some_id",
    "test@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  transformerUser.transform(user)

  const playlist = new PlaylistEntity(
    "some_id_1",
    "some_name",
    [
      new ContentEntity(
        "some_id_2",
        15,
        new FileEntity(
          "some_id_3",
          1214214,
          "http://localhost/1.jpg",
          "/tmp/1.jpg",
          new Date(),
          new Date()
        ),
        new Date(),
        new Date()
      )
    ],
    new Date(),
    new Date()
  )

  transformerPlaylist.transform(playlist, user)

  const either_2 = await u.create({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647,
    playlistId: "some_id_1",
    token: "invalid token"
  })

  assert.strictEqual(either_2.isLeft(), true)
})