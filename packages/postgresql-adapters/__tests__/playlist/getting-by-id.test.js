import test from 'node:test';
import assert from 'node:assert';
import { InsertingPlaylist } from '../../lib/index.t.mjs';
import { GettingPlaylistById } from '../../lib/index.t.mjs';
import { GettingUserByEmail } from '../../lib/index.t.mjs';
import { pgPool } from '../../lib/index.t.mjs';
import { PlaylistEntity, ContentEntity, FileEntity } from 'core';

test('Get', async () => {
  const gettingUserByEmail = new GettingUserByEmail(pgPool)

  const either_0 = await gettingUserByEmail.get("stasmoriniv@gmail.com")

  const playlist = new PlaylistEntity(
    "892266d7-9237-4ba0-a960-de6cdc5e96df",
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

  const a = new GettingPlaylistById(pgPool)

  await inserting.transform(playlist, either_0.value)

  const either_1 = await a.get("892266d7-9237-4ba0-a960-de6cdc5e96df")

  assert.strictEqual(either_1.isRight(), true)
})

test('Not found', async () => {
  const a = new GettingPlaylistById(pgPool)

  const either_1 = await a.get("0a133a3b-1a52-499d-9908-8574820817e1")

  assert.strictEqual(either_1.isLeft(), true)
})