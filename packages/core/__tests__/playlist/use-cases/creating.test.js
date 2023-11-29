import test from 'node:test';
import assert from 'node:assert';
import { UserEntity } from '../../../lib/index.t.mjs';
import { PlaylistEntity } from '../../../lib/index.t.mjs';
import { UseCaseAuthorization } from '../../../lib/index.t.mjs';
import { UseCasePlaylistCreating } from '../../../lib/index.t.mjs';
import { right, left } from "@sweet-monads/either";
import jwt from 'jsonwebtoken';
import fs from 'fs';

fs.writeFileSync("/tmp/test.png", "Some content!")

fs.writeFileSync("/tmp/test.jpg", "")

fs.writeFileSync("/tmp/test.txt", "Some content!")

let users = {}
let playlists = {}
let contents = []

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

const transformerContents = {
  async transform(cnts = []) {
    contents = [...contents, ...cnts]

    return right(true)
  }
}

const authorizationUseCase = new UseCaseAuthorization(getterUser, "some_secret_key")
const u = new UseCasePlaylistCreating(authorizationUseCase, transformerContents, transformerPlaylist)

test('Create playlist', async () => {
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
    name: "test",
    contents: [
      {
        displayDuration: 20,
        file: {
          path: "/tmp/test.png"
        }
      }
    ],
    url: "http://localhost:8081",
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

  const either_2 = await u.create({
    name: "test",
    contents: [
      {
        displayDuration: 20,
        file: {
          path: "/tmp/test.png"
        }
      }
    ],
    url: "http://localhost:8081",
    token: "invalid token"
  })

  assert.strictEqual(either_2.isLeft(), true)
})