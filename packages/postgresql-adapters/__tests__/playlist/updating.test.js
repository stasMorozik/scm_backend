import test from 'node:test';
import assert from 'node:assert';
import { UpdatingPlaylist } from '../../lib/index.t.mjs';
import { InsertingPlaylist } from '../../lib/index.t.mjs';
import { GettingUserByEmail } from '../../lib/index.t.mjs';
import { pgPool } from '../../lib/index.t.mjs';
import { PlaylistEntity, ContentEntity, FileEntity } from 'core';

test('Update playlist', async () => {
  
  const gettingUserByEmail = new GettingUserByEmail(pgPool)

  const either_0 = await gettingUserByEmail.get("stasmoriniv@gmail.com")

  const playlist = new PlaylistEntity(
    "155e3c6a-0308-47f2-a7ad-f6a5d49a8770",
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

  const inserting = new InsertingPlaylist(pgPool)

  await inserting.transform(playlist, either_0.value)

  const a = new UpdatingPlaylist(pgPool)

  const either_1 = await a.transform(playlist)
  
  assert.strictEqual(either_1.isRight(), true)
})
