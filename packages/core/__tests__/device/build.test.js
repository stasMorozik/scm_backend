import test from 'node:test';
import assert from 'node:assert';
import { buildDevice as build } from '../../lib/index.t.mjs';

test('Build entity', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647
  })
  
  assert.strictEqual(either.isRight(), true)
})

test('Invalid ssh port', () => {
  const either = build({
    sshPort: -22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647
  })
  
  assert.strictEqual(either.isLeft(), true)
})

test('Ssh port as a string', () => {
  const either = build({
    sshPort: "sdf",
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647
  })
  
  assert.strictEqual(either.isLeft(), true)
})

test('Invalid ssh host', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.!",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647
  })
  
  assert.strictEqual(either.isLeft(), true)
})

test('Empty ssh host', () => {
  const either = build({
    sshPort: 22,
    sshHost: "",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: 55.7487647
  })
  
  assert.strictEqual(either.isLeft(), true)
})

test('Invalid address', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва",
    longitude: 37.705471,
    latitude: 55.7487647
  })
  
  assert.strictEqual(either.isLeft(), true)
})

test('Invalid longitude', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 370.705471,
    latitude: 55.7487647
  })
  
  assert.strictEqual(either.isLeft(), true)
})

test('Longitude as a string', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: "sdf",
    latitude: 55.7487647
  })
  
  assert.strictEqual(either.isLeft(), true)
})

test('Invalid latitude', () => {
  const either = build({
    sshPort: 22,
    sshHost: "192.168.1.160",
    sshUser: "admin",
    sshPassword: "1qw23er4",
    address: "Москва ш. Энтузиастов, 12 к.2, Москва, 111024",
    longitude: 37.705471,
    latitude: -550.7487647
  })
  
  assert.strictEqual(either.isLeft(), true)
})