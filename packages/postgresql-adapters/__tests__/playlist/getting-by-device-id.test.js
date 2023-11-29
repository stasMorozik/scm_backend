import test from 'node:test';
import assert from 'node:assert';
import { InsertingDevice } from '../../lib/index.t.mjs';
import { InsertingPlaylist } from '../../lib/index.t.mjs';
import { GettingPlaylistByDeviceId } from '../../lib/index.t.mjs';
import { GettingUserByEmail } from '../../lib/index.t.mjs';
import { PlaylistEntity, ContentEntity, FileEntity, DeviceEntity } from 'core';
import { pgPool } from '../../lib/index.t.mjs';

test('Get', async () => {
  const gettingUserByEmail = new GettingUserByEmail(pgPool)

  const either_0 = await gettingUserByEmail.get("stasmoriniv@gmail.com")

  const playlist = new PlaylistEntity(
    "447b63a0-2bdf-4304-bda6-22ebf7535fc5",
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

	const device = new DeviceEntity(
    "f94a2422-afe0-4653-a8b7-ee2f679b729c",
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
	const insertingDevice = new InsertingDevice(pgPool)

  const a = new GettingPlaylistByDeviceId(pgPool)

  await insertingPlaylist.transform(playlist, either_0.value)
	await insertingDevice.transform(device, playlist, either_0.value)

  const either_1 = await a.get("f94a2422-afe0-4653-a8b7-ee2f679b729c")

  assert.strictEqual(either_1.isRight(), true)
})

test('Not found', async () => {
  const a = new GettingPlaylistByDeviceId(pgPool)

  const either_1 = await a.get("0a133a3b-1a52-499d-9908-8574820817e2")

  assert.strictEqual(either_1.isLeft(), true)
})
