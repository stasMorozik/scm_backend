import test from 'node:test';
import assert from 'node:assert';
import { InsertingPlaylist } from '../../lib/index.t.mjs';
import { GettingUserByEmail } from '../../lib/index.t.mjs';
import { pgPool } from '../../lib/index.t.mjs';
import { PlaylistEntity, ContentEntity, FileEntity } from 'core';

test('Insert playlist', async () => {

  const gettingUserByEmail = new GettingUserByEmail(pgPool)

  const either_0 = await gettingUserByEmail.get("stasmoriniv@gmail.com")

  const playlist = new PlaylistEntity(
    "aa1c7378-8874-4b35-9b0d-ed53b810eb0c",
    "some_name",
    [
      new ContentEntity(
        "18f35701-672e-4e13-9e92-2405bb6239e9",
        15,
        new FileEntity(
          "26eeda5a-2cb8-4028-9ba3-6425c775cfff",
          1214214,
          "http://localhost/1.jpg",
          "/tmp/1.jpg",
          new Date(),
          new Date()
        ),
        new Date(),
        new Date()
      )
    ],
    new Date(),
    new Date()
  )

  const a = new InsertingPlaylist(pgPool)

  const either_1 = await a.transform(playlist, either_0.value)
  
  assert.strictEqual(either_1.isRight(), true)
})