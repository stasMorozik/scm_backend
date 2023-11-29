import test from 'node:test';
import assert from 'node:assert';
import { UseCaseConfirmationCodeCreating } from '../../../lib/index.t.mjs';
import { ConfirmationCodeEntity as Entity } from '../../../lib/index.t.mjs';
import { right, left } from "@sweet-monads/either";

class Transformer {
  codes = []

  async transform(entity = {}) {
    if ((entity instanceof Entity) == false) {
      return left(new Error("Не валидные данные"))
    }

    this.codes = [...this.codes, entity]

    return right(true)
  }
}

class Notifier {
  async notify(mail = {
    to: "",
    from: "",
    subject: "",
    message: ""
  }) {
    return right(true)
  }
}

const u = new UseCaseConfirmationCodeCreating(new Transformer(), new Notifier())

test('Create entity', async () => {
  const either = await u.create({needle: "test@gmail.com"})

  assert.strictEqual(either.isRight(), true)
})

test('Invalid email', async () => {
  const either = await u.create({needle: "test@gmail."})

  assert.strictEqual(either.isLeft(), true)
})

test('Empty args', async () => {
  const either = await u.create()

  assert.strictEqual(either.isLeft(), true)
})