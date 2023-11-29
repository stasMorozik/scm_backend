import test from 'node:test';
import assert from 'node:assert';
import { UserEntity } from '../../../lib/index.t.mjs';
import { PlaylistEntity } from '../../../lib/index.t.mjs';
import { ContentEntity } from '../../../lib/index.t.mjs';
import { FileEntity } from '../../../lib/index.t.mjs';
import { UseCaseAuthorization } from '../../../lib/index.t.mjs';
import { UseCasePlaylistGettingList } from '../../../lib/index.t.mjs';
import { right, left } from "@sweet-monads/either";
import jwt from 'jsonwebtoken';
import fs from 'fs';

fs.writeFileSync("/tmp/test.png", "Some content!")

fs.writeFileSync("/tmp/test.jpg", "")

fs.writeFileSync("/tmp/test.txt", "Some content!")

let users = {}
let playlists = {}

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
      return left(new Error("Пользователь не найден"))
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

const getterListPlaylist = {
  async get(_filter, _sort, _pagi) {

    return right(playlists)
  }
}

const authorizationUseCase = new UseCaseAuthorization(getterUser, "some_secret_key")
const u = new UseCasePlaylistGettingList(
  authorizationUseCase, 
  getterListPlaylist
)

test('Getting list', async () => {
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

  const either_2 = await u.get({
    filter: {
      name: "test"
    },
    sort: {
      created: "desc"
    },
    pagi: {
      page: 1,
      limit: 10
    },
    token: access
  })

  assert.strictEqual(either_2.isRight(), true)
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

  const either_2 = await u.get({
    filter: {
      name: "test"
    },
    sort: {
      created: "desc"
    },
    pagi: {
      page: 1,
      limit: 10
    },
    token: "invalid token"
  })

  assert.strictEqual(either_2.isLeft(), true)
})