import test from 'node:test';
import assert from 'node:assert';
import { buildPlaylist as build } from '../../lib/index.t.mjs';
import fs from 'fs';

fs.writeFileSync("/tmp/test.png", "Some content!")

fs.writeFileSync("/tmp/test.jpg", "")

fs.writeFileSync("/tmp/test.txt", "Some content!")

test('Build entity', () => {
  const either = build({
    name: "test",
    contents: [
      {
        displayDuration: 20,
        file: {
          path: "/tmp/test.png"
        }
      }
    ],
    url: "http://localhost:8081"
  })

  assert.strictEqual(either.isRight(), true)
})

test('Invalid extension', () => {
  const either = build({
    name: "test",
    contents: [
      {
        displayDuration: 20,
        file: {
          path: "/tmp/test.txt"
        }
      }
    ],
    url: "http://localhost:8081"
  })

  assert.strictEqual(either.isLeft(), true)
})