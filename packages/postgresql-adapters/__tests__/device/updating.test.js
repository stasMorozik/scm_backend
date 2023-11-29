import test from 'node:test';
import assert from 'node:assert';
import { InsertingDevice } from '../../lib/index.t.mjs';
import { UpdatingDevice } from '../../lib/index.t.mjs';
import { InsertingPlaylist } from '../../lib/index.t.mjs';
import { GettingUserByEmail } from '../../lib/index.t.mjs';
import { pgPool } from '../../lib/index.t.mjs';
import { PlaylistEntity, ContentEntity, FileEntity, DeviceEntity } from 'core';

test('Update playlist', async () => {
  const gettingUserByEmail = new GettingUserByEmail(pgPool)

  const either_0 = await gettingUserByEmail.get("stasmoriniv@gmail.com")

  const playlist = new PlaylistEntity(
    "20e192e5-6391-4fb1-88a4-7fb8c1803c98",
    "some_name",
    [
      new ContentEntity(
        "230966be-e89c-4439-bfe6-8a9dfada6520",
        15,
        new FileEntity(
          "bc69248c-899e-4ddb-b580-b248b6b5a3a6",
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

  const device = new DeviceEntity(
    "32f53e7a-826b-49c7-88ac-b3ebd8d14f1e",
    22,
    "192.168.1.160",
    "admin",
    "1qw23er4",
    "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    37.705471,
    55.7487647,
    false,
    new Date(),
    new Date()
  )

  const insertingPlaylist = new InsertingPlaylist(pgPool)

  await insertingPlaylist.transform(playlist, either_0.value)

  const insertingDevice = new InsertingDevice(pgPool)

  await insertingDevice.transform(device, playlist, either_0.value)

	const a = new UpdatingDevice(pgPool)

	const either_1 = await a.transform(device, playlist, either_0.value)
  
  assert.strictEqual(either_1.isRight(), true)
})
