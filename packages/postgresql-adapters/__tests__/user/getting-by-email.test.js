import test from 'node:test';
import assert from 'node:assert';
import { GettingUserByEmail } from '../../lib/index.t.mjs';
import { pgPool } from '../../lib/index.t.mjs';

test('Get user', async () => {
  const a = new GettingUserByEmail(pgPool)

  const either = await a.get("stasmoriniv@gmail.com")

  assert.strictEqual(either.isRight(), true)
})

test('User not found', async () => {
  const a = new GettingUserByEmail(pgPool)

  const either = await a.get("not_found_user@gmail.com")

  assert.strictEqual(either.isLeft(), true)
})