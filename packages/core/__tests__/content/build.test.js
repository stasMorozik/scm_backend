import test from 'node:test';
import assert from 'node:assert';
import { buildContent as build } from '../../lib/index.t.mjs';
import fs from 'fs';

fs.writeFileSync("/tmp/test.png", "Some content!")

fs.writeFileSync("/tmp/test.jpg", "")

fs.writeFileSync("/tmp/test.txt", "Some content!")

test('Build entity', () => {
  const either = build({
    displayDuration: 20,
    url: "http://localhost",
    file: {
      path: "/tmp/test.png"
    }
  })

  assert.strictEqual(either.isRight(), true)
})

test('Invalid duration', () => {
  const either = build({
    displayDuration: -20,
    url: "http://localhost",
    file: {
      path: "/tmp/test.png"
    }
  })

  assert.strictEqual(either.isLeft(), true)
})

test('Invalid size', () => {
  const either = build({
    displayDuration: 20,
    url: "http://localhost",
    file: {
      path: "/tmp/test.jpg"
    }
  })

  assert.strictEqual(either.isLeft(), true)
})

test('File not exist', () => {
  const either = build({
    displayDuration: -20,
    url: "http://localhost",
    file: {
      path: "/tmp/test.jpeg"
    }
  })

  assert.strictEqual(either.isLeft(), true)
})

test('Invalid extension', () => {
  const either = build({
    displayDuration: -20,
    url: "http://localhost",
    file: {
      path: "/tmp/test.txt"
    }
  })

  assert.strictEqual(either.isLeft(), true)
})