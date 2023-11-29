import test from 'node:test';
import assert from 'node:assert';
import { UseCaseConfirmationCodeConfirming } from '../../../lib/index.t.mjs';
import { Error } from '../../../lib/index.t.mjs';
import { buildConfirmationCode as build } from '../../../lib/index.t.mjs';
import { ConfirmationCodeEntity as Entity } from '../../../lib/index.t.mjs';
import { right, left } from "@sweet-monads/either";

let codes = {}

const transformer = {
  async transform(entity = {}) {
    if ((entity instanceof Entity) == false) {
      return left(new Error("Не валидные данные"))
    }

    codes[entity.needle] = entity

    return right(true)
  }
}

const getter = {
  async get(needle ="") {
    const maybeEntity = codes[needle]

    if(!maybeEntity) {
      return left(new Error("Код не найден"))
    }

    return right(maybeEntity)
  }
}

const u = new UseCaseConfirmationCodeConfirming(transformer, getter)

test('Confirm email address', async () => {
  const either = build({
    needle: "test@gmail.com"
  })

  transformer.transform(either.value)

  const either_0 = await u.confirm({needle: "test@gmail.com", code: either.value.code})
  
  assert.strictEqual(either_0.isRight(), true)
})

test('Invalid email address', async () => {
  const either = build({
    needle: "test@gmail.com"
  })

  transformer.transform(either.value)

  const either_0 = await u.confirm({needle: "test@gmail.", code: either.value.code})

  assert.strictEqual(either_0.isLeft(), true)
})

test('Not found code', async () => {
  const either = build({
    needle: "test@gmail.com"
  })

  transformer.transform(either.value)

  const either_0 = await u.confirm({needle: "test1@gmail.com", code: either.value.code})

  assert.strictEqual(either_0.isLeft(), true)
})