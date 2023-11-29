import test from 'node:test';
import assert from 'node:assert';
import { buildConfirmationCode as build } from '../../lib/index.t.mjs';
import { ConfirmationCodeEntity as Entity } from '../../lib/index.t.mjs';
import { confirmConfirmationCode as confirm } from '../../lib/index.t.mjs';
import { verifyCodeConfirmation as verify } from '../../lib/index.t.mjs';
import { hasConfirmation } from '../../lib/index.t.mjs';

test('Has confirmation', () => {
  const either = build({
    needle: "test@gmail.com"
  })

  const either_1 = hasConfirmation(either.value)
  
  assert.strictEqual(either_1.isLeft(), true)
})

test('Verify code', () => {
  const either = build({
    needle: "test@gmail.com"
  })

  const either_1 = verify(either.value.code, either.value)
  
  assert.strictEqual(either_1.isRight(), true)
})

test('Confirm code', () => {
  const either = build({
    needle: "test@gmail.com"
  })

  const either_1 = confirm(either.value.code, either.value)
  
  assert.strictEqual(either_1.isRight(), true)
})

test('Wrong code', () => {
  const either = build({
    needle: "test@gmail.com"
  })

  const either_1 = verify(123, either.value)
  
  assert.strictEqual(either_1.isLeft(), true)
})

test('Wrong code 2', () => {
  const either = build({
    needle: "test@gmail.com"
  })

  const either_1 = confirm(123, either.value)
  
  assert.strictEqual(either_1.isLeft(), true)
})

test('Wrong created', () => {
  const entity = new Entity(
    "test@gmail.com", 
    Math.floor(new Date(2011, 0, 1, 0, 0, 0, 0).getTime() / 1000),
    Math.random() * (9999 - 1000) + 1000,
    false
  )

  const either = verify(entity.code, entity)
  
  assert.strictEqual(either.isLeft(), true)
})