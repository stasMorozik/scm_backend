import test from 'node:test';
import assert from 'node:assert';
import { buildDevice as build } from '../../lib/index.t.mjs';
import { editDevice as edit } from '../../lib/index.t.mjs';

test('Edit entity', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647
  })

  const either_1 = edit(either.value, {
    sshPort: 23,
    sshHost: "192.168.1.161",
    sshUser: "user",
    sshPassword: "1qw23er5",
    address: "Москва ш. Энтузиастов, 14 к.2, Москва, 111024",
    longitude: 37.705472,
    latitude: 55.7487648
  })
  
  assert.strictEqual(either_1.isRight(), true)
})

test('Invalid port', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647
  })

  const either_1 = edit(either.value, {sshPort: -22})
  
  assert.strictEqual(either_1.isLeft(), true)
})

test('Edit ssh host', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647
  })

  const either_1 = edit(either.value, {sshHost: "192.168.1.161"})

  assert.strictEqual(either_1.value.sshHost, "192.168.1.161")
})