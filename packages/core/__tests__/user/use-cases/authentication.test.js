import test from 'node:test';
import assert from 'node:assert';
import { UserEntity } from '../../../lib/index.t.mjs';
import { ConfirmationCodeEntity } from '../../../lib/index.t.mjs';
import { UseCaseAuthentication } from '../../../lib/index.t.mjs';
import { confirmConfirmationCode as confirm } from '../../../lib/index.t.mjs';
import { buildConfirmationCode as build } from '../../../lib/index.t.mjs';
import { right, left } from "@sweet-monads/either";

let users = {}
let codes = {}

const transformerCode = {
  async transform(entity = {}) {
    if ((entity instanceof ConfirmationCodeEntity) == false) {
      return left(new Error("Не валидные данные"))
    }

    codes[entity.needle] = entity

    return right(true)
  }
}

const getterCode = {
  async get(needle ="") {
    const maybeEntity = codes[needle]

    if(!maybeEntity) {
      return left(new Error("Код не найден"))
    }

    return right(maybeEntity)
  }
}

const transformerUser = {
  async transform(entity = {}) {
    if ((entity instanceof UserEntity) == false) {
      return left(new Error("Не валидные данные"))
    }

    users[entity.email] = entity

    return right(true)
  }
}

const getterUser = {
  async get(email ="") {
    const maybeEntity = users[email]

    if(!maybeEntity) {
      return left(new Error("Пользователь найден"))
    }

    return right(maybeEntity)
  }
}

const u = new UseCaseAuthentication(getterUser, getterCode, "some_secret_key")

test('Authentication user', async () => {
  const either = build({
    needle: "test@gmail.com"
  })

  const either_1 = confirm(either.value.code, either.value)

  transformerCode.transform(either_1.value)

  const user = new UserEntity(
    "some_id",
    "test@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  transformerUser.transform(user)

  const either_2 = await u.auth({email: "test@gmail.com"})

  assert.strictEqual(either_2.isRight(), true)
})

test('User not found', async () => {
  const either = build({
    needle: "test1@gmail.com"
  })

  const either_1 = confirm(either.value.code, either.value)

  transformerCode.transform(either_1.value)

  const user = new UserEntity(
    "some_id",
    "test10@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  transformerUser.transform(user)

  const either_2 = await u.auth({email: "test1@gmail.com"})

  assert.strictEqual(either_2.isLeft(), true)
})

test('Code not found', async () => {
  const either = build({
    needle: "test2@gmail.com"
  })

  const either_1 = confirm(either.value.code, either.value)

  transformerCode.transform(either_1.value)

  const user = new UserEntity(
    "some_id",
    "test2@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  transformerUser.transform(user)

  const either_2 = await u.auth({email: "test3@gmail.com"})

  assert.strictEqual(either_2.isLeft(), true)
})

test('Email is not confirmation', async () => {
  const either = build({
    needle: "test30@gmail.com"
  })

  transformerCode.transform(either.value)

  const user = new UserEntity(
    "some_id",
    "test30@gmail.com",
    "Alex",
    "Cross",
    new Date(),
    new Date()
  )

  transformerUser.transform(user)

  const either_2 = await u.auth({email: "test30@gmail.com"})

  assert.strictEqual(either_2.isLeft(), true)
})