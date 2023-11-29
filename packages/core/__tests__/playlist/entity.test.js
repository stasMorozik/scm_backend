import test from 'node:test';
import assert from 'node:assert';
import { editPlaylist as edit } from '../../lib/index.t.mjs';
import { buildPlaylist as build } from '../../lib/index.t.mjs';
import fs from 'fs';

fs.writeFileSync("/tmp/test.png", "Some content!")

fs.writeFileSync("/tmp/test.jpg", "")

fs.writeFileSync("/tmp/test.txt", "Some content!")

test('Edit entity', () => {
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

  const args = {
    name: "test_1",
    contents: [
      {
        displayDuration: 25,
        file: {
          path: "/tmp/test.png"
        }
      }
    ],
    url: "http://localhost:8081"
  }

  args.deleteContents = {}

  args.deleteContents[either.value.contents[0].id] = true

  const either_1 = edit(either.value, args)
 
  assert.strictEqual(either_1.value.contents[0].displayDuration, 25)

  assert.strictEqual(either_1.isRight(), true)
})