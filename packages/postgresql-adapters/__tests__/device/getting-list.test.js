import test from 'node:test';
import assert from 'node:assert';
import { InsertingDevice } from '../../lib/index.t.mjs';
import { InsertingPlaylist } from '../../lib/index.t.mjs';
import { GettingUserByEmail } from '../../lib/index.t.mjs';
import { GettingDeviceList } from '../../lib/index.t.mjs';
import { pgPool } from '../../lib/index.t.mjs';
import { 
  PlaylistEntity,
  ContentEntity,
  FileEntity,
  DeviceEntity,
  FilterDevice,
  SortDevice,
  Pagi
} from 'core';

test('Get list', async () => {
  const gettingUserByEmail = new GettingUserByEmail(pgPool)

  const either_0 = await gettingUserByEmail.get("stasmoriniv@gmail.com")

  const playlist_0 = new PlaylistEntity(
    "9e817902-6086-4b7a-acc9-6ea46e96d5ef",
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
    "7b96d459-81ef-4432-ad33-b0d838f8eacb",
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

  const device_0 = new DeviceEntity(
    "2c8a34e3-3553-43e9-8d24-fdc1f2a06001",
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

  const device_1 = new DeviceEntity(
    "562dd623-01f6-4caf-8006-9aad2e371216",
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

  await insertingPlaylist.transform(playlist_0, either_0.value)
  await insertingDevice.transform(device_0, playlist_0, either_0.value)

  await insertingPlaylist.transform(playlist_1, either_0.value)
  await insertingDevice.transform(device_1, playlist_1, either_0.value)

  const a = new GettingDeviceList(pgPool)

  const either_1 = await a.get(
    new FilterDevice(
      either_0.value.id,
      false,
      null,
      null,
      null,
      null
    ),
    new SortDevice(
      "DESC",
      null
    ),
    new Pagi(
      10, 
      1
    )
  )
  
  assert.strictEqual(either_1.isRight(), true)
})