import test from 'node:test';
import assert from 'node:assert';
import { InsertingPlaylist } from '../../lib/index.t.mjs';
import { GettingPlaylistList } from '../../lib/index.t.mjs';
import { GettingUserByEmail } from '../../lib/index.t.mjs';
import { pgPool } from '../../lib/index.t.mjs';
import { 
  PlaylistEntity, 
  ContentEntity, 
  FileEntity,
  FilterPlaylist,
  SortPlaylist,
  Pagi
} from 'core';

test('Get list', async () => {

  const gettingUserByEmail = new GettingUserByEmail(pgPool)

  const either_0 = await gettingUserByEmail.get("stasmoriniv@gmail.com")

  const playlist_0 = new PlaylistEntity(
    "3c5d4aef-2369-41bb-91a9-12284df610e0",
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

  const playlist_1 = new PlaylistEntity(
    "00de88bf-f919-4ff0-b68d-96438c81c248",
    "some_name",
    [
      new ContentEntity(
        "18f35701-672e-4e13-9e92-2405bb6239e8",
        15,
        new FileEntity(
          "26eeda5a-2cb8-4028-9ba3-6425c775cffd",
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

  const a = new GettingPlaylistList(pgPool)

  await inserting.transform(playlist_0, either_0.value)
  await inserting.transform(playlist_1, either_0.value)

  const either_1 = await a.get(
    new FilterPlaylist(
      either_0.value.id,
      "some_name",
      null,
      null
    ),
    new SortPlaylist(
      "ASC",
      null
    ),
    new Pagi(
      10,
      1
    )
  )
  
  assert.strictEqual(either_1.isRight(), true)
})