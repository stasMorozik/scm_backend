import { Entity } from '../entity';
import { valid as latitudeValid } from '../validators/latitude';
import { valid as longitudeValid } from '../validators/longitude';
import { valid as sshDataValid } from '../validators/ssh-data';
import { valid as sshPortValid } from '../validators/ssh-port';
import { valid as addressValid } from '../validators/address';
import { right, left } from "@sweet-monads/either";

const updated = (entity) => {
  return right(new Entity(
    entity.id,
    entity.sshPort,
    entity.sshHost,
    entity.sshUser,
    entity.sshPassword,
    entity.address,
    entity.longitude,
    entity.latitude,
    entity.isActive,
    entity.created,
    new Date()
  ))
}

const sshPort = (entity, sshPort) => {
  if (sshPort == null || sshPort == undefined) {
    return right(entity)
  }

  return sshPortValid(sshPort).map(() => new Entity(
    entity.id,
    sshPort,
    entity.sshHost,
    entity.sshUser,
    entity.sshPassword,
    entity.address,
    entity.longitude,
    entity.latitude,
    entity.isActive,
    entity.created,
    entity.updated
  ))
}

const sshHost = (entity, sshHost) => {
  if (sshHost == null || sshHost == undefined) {
    return right(entity)
  }

  return sshDataValid(sshHost).map(() => new Entity(
    entity.id,
    entity.sshPort,
    sshHost,
    entity.sshUser,
    entity.sshPassword,
    entity.address,
    entity.longitude,
    entity.latitude,
    entity.isActive,
    entity.created,
    entity.updated
  ))
}

const sshUser = (entity, sshUser) => {
  if (sshUser == null || sshUser == undefined) {
    return right(entity)
  }

  return sshDataValid(sshUser).map(() => new Entity(
    entity.id,
    entity.sshPort,
    entity.sshHost,
    sshUser,
    entity.sshPassword,
    entity.address,
    entity.longitude,
    entity.latitude,
    entity.isActive,
    entity.created,
    entity.updated
  ))
}

const sshPassword = (entity, sshPassword) => {
  if (sshPassword == null || sshPassword == undefined) {
    return right(entity)
  }

  return sshDataValid(sshPassword).map(() => new Entity(
    entity.id,
    entity.sshPort,
    entity.sshHost,
    entity.sshUser,
    sshPassword,
    entity.address,
    entity.longitude,
    entity.latitude,
    entity.isActive,
    entity.created,
    entity.updated
  ))
}

const address = (entity, address) => {
  if (address == null || address == undefined) {
    return right(entity)
  }

  return addressValid(address).map(() => new Entity(
    entity.id,
    entity.sshPort,
    entity.sshHost,
    entity.sshUser,
    entity.sshPassword,
    address,
    entity.longitude,
    entity.latitude,
    entity.isActive,
    entity.created,
    entity.updated
  ))
}

const longitude = (entity, longitude) => {
  if (longitude == null || longitude == undefined) {
    return right(entity)
  }

  return longitudeValid(longitude).map(() => new Entity(
    entity.id,
    entity.sshPort,
    entity.sshHost,
    entity.sshUser,
    entity.sshPassword,
    entity.address,
    longitude,
    entity.latitude,
    entity.isActive,
    entity.created,
    entity.updated
  ))
}

const latitude = (entity, latitude) => {
  if (latitude == null || latitude == undefined) {
    return right(entity)
  }

  return latitudeValid(latitude).map(() => new Entity(
    entity.id,
    entity.sshPort,
    entity.sshHost,
    entity.sshUser,
    entity.sshPassword,
    entity.address,
    entity.longitude,
    latitude,
    entity.isActive,
    entity.created,
    entity.updated
  ))
}

const isActive = (entity, isActive) => {
  if (isActive == null || isActive == undefined) {
    return right(entity)
  }

  return right(new Entity(
    entity.id,
    entity.sshPort,
    entity.sshHost,
    entity.sshUser,
    entity.sshPassword,
    entity.address,
    entity.longitude,
    entity.latitude,
    isActive ? true : false,
    entity.created,
    entity.updated
  ))
}

export function edit(entity = {}, args = {}) {
  if ((entity instanceof Entity) == false) {
    return left(new Error("Не валидные данные для редактирования устройства"))
  }

  return updated(entity).chain(
    (entity) => sshPort(entity, args.sshPort)
  ).chain(
    (entity) => sshHost(entity, args.sshHost)
  ).chain(
    (entity) => sshUser(entity, args.sshUser)
  ).chain(
    (entity) => sshPassword(entity, args.sshPassword)
  ).chain(
    (entity) => address(entity, args.address)
  ).chain(
    (entity) => longitude(entity, args.longitude)
  ).chain(
    (entity) => latitude(entity, args.latitude)
  ).chain(
    (entity) => isActive(entity, args.isActive)
  )
}