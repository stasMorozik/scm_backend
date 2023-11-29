import test from 'node:test';
import assert from 'node:assert';
import { buildConfirmationCode as build } from '../../lib/index.t.mjs';

test('Build entity', () => {
  const either = build({
    needle: "test@gmail.com"
  })
  
  assert.strictEqual(either.isRight(), true)
})

test('Invalid email', () => {
  const either = build({
    needle: "test@gmail."
  })
  
  assert.strictEqual(either.isLeft(), true)
})

test('Empty args', () => {
  const either = build()
  
  assert.strictEqual(either.isLeft(), true)
})