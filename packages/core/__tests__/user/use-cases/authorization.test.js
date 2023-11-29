import test from 'node:test';
import assert from 'node:assert';
import { UserEntity } from '../../../lib/index.t.mjs';
import { UseCaseAuthorization } from '../../../lib/index.t.mjs';
import { right, left } from "@sweet-monads/either";
import jwt from 'jsonwebtoken';

let users = {}

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

const u = new UseCaseAuthorization(getterUser, "some_secret_key")

test('Authorization user', async () => {
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

  const either_2 = await u.auth({token: access})

  assert.strictEqual(either_2.isRight(), true)
})

test('User not found', async () => {
  const user = new UserEntity(
    "some_id_2",
    "test2@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  const access = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 3600,
    id: user.id
  }, "some_secret_key")

  const either_2 = await u.auth({token: access})

  assert.strictEqual(either_2.isLeft(), true)
})

test('Invalid token', async () => {
  const user = new UserEntity(
    "some_id_3",
    "test3@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  transformerUser.transform(user)

  const either_2 = await u.auth({token: "invalid_token"})

  assert.strictEqual(either_2.isLeft(), true)
})