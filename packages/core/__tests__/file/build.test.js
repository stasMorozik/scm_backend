import test from 'node:test';
import assert from 'node:assert';
import { buildFile as build } from '../../lib/index.t.mjs';
import fs from 'fs';

fs.writeFileSync("/tmp/test.png", "Some content!")

fs.writeFileSync("/tmp/test.jpg", "")

fs.writeFileSync("/tmp/test.txt", "Some content!")

fs.writeFileSync("/tmp/TEST.PNG", "Some content!")

test('Build entity', () => {
  const either = build({
    url: "http://localhost:8081",
    path: "/tmp/test.png"
  })

  assert.strictEqual(either.isRight(), true)
})

test('Upper case extension', () => {
  const either = build({
    url: "http://localhost:8081",
    path: "/tmp/TEST.PNG"
  })

  assert.strictEqual(either.isRight(), true)
})

test('Invalid size', () => {
  const either = build({
    url: "http://localhost:8081",
    path: "/tmp/test.jpg"
  })

  assert.strictEqual(either.isLeft(), true)
})

test('File not exist', () => {
  const either = build({
    url: "http://localhost:8081",
    path: "/tmp/test.jpeg"
  })

  assert.strictEqual(either.isLeft(), true)
})

test('Invalid extension', () => {
  const either = build({
    url: "http://localhost:8081",
    path: "/tmp/test.txt"
  })

  assert.strictEqual(either.isLeft(), true)
})