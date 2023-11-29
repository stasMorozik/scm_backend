import fs from 'fs';
import test from 'node:test';
import assert from 'node:assert';
import { ContentStorageTransformer } from '../../lib/index.t.mjs';
import { ContentEntity, FileEntity } from 'core';

fs.writeFileSync("/tmp/test.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 124 124" fill="none">
<rect width="124" height="124" rx="24" fill="#F97316"/>
<path d="M19.375 36.7818V100.625C19.375 102.834 21.1659 104.625 23.375 104.625H87.2181C90.7818 104.625 92.5664 100.316 90.0466 97.7966L26.2034 33.9534C23.6836 31.4336 19.375 33.2182 19.375 36.7818Z" fill="white"/>
<circle cx="63.2109" cy="37.5391" r="18.1641" fill="black"/>
<rect opacity="0.4" x="81.1328" y="80.7198" width="17.5687" height="17.3876" rx="4" transform="rotate(-45 81.1328 80.7198)" fill="#FDBA74"/>
</svg>`)



test('Transform', async () => {
  const contents = [
    new ContentEntity(
      "some_id_2",
      15,
      new FileEntity(
        "some_id_3",
        1214214,
        `${process.env.URL}/some_id_3/test.svg`,
        "/tmp/test.svg",
        new Date(),
        new Date()
      ),
      new Date(),
      new Date()
    )
  ]

  const a = new ContentStorageTransformer(process.env.USER, process.env.PASSWORD)

  const either_1 = await a.transform(contents)

  assert.strictEqual(either_1.isRight(), true)
})

test('Transform 1', async () => {
  const contents = [
    new ContentEntity(
      "some_id_2",
      15,
      new FileEntity(
        "some_id_3",
        1214214,
        `${process.env.URL}/some_id_3/test.svg`,
        "/tmp/test.svg",
        new Date(),
        new Date()
      ),
      new Date(),
      new Date()
    )
  ]

  const a = new ContentStorageTransformer(process.env.USER, process.env.PASSWORD)

  const either_1 = await a.transform(contents)

  assert.strictEqual(either_1.isRight(), true)
})

test('Invalid auth', async () => {
  const contents = [
    new ContentEntity(
      "some_id_2",
      15,
      new FileEntity(
        "some_id_3",
        1214214,
        "http://192.168.0.161:8100/upload/some_id_3/test.svg",
        "/tmp/test.svg",
        new Date(),
        new Date()
      ),
      new Date(),
      new Date()
    )
  ]

  const a = new ContentStorageTransformer(process.env.USER, "invalid password")

  const either_1 = await a.transform(contents)

  assert.strictEqual(either_1.isLeft(), true)
})