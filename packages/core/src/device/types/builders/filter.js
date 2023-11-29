import { right } from "@sweet-monads/either";
import { Filter as FilterType } from '../filter';
import { valid as addressValid } from '../../../device/validators/address';
import { valid as sshDataValid } from '../../../device/validators/ssh-data';
import { valid as dateValid } from '../../../shared/validators/date';
import { valid as boolValid } from '../../../shared/validators/bool';
import { valid as uuidValid } from "../../../shared/validators/uuid";

const type = () => {
  return right(new FilterType(
    null,
    null,
    null,
    null,
    null,
    null
  ))
}

const createdF = (type, createdF) => {
  if (createdF == null || createdF == undefined) {
    return right(type)
  }

  return dateValid(createdF).map((date) => new FilterType(
    type.userId,
    type.playlistId,
    type.isActive,
    type.address,
    type.sshHost,
    date,
    type.createdT
  ))
}

const createdT = (type, createdT) => {
  if (createdT == null || createdT == undefined) {
    return right(type)
  }

  return dateValid(createdT).map((date) => new FilterType(
    type.userId,
    type.playlistId,
    type.isActive,
    type.address,
    type.sshHost,
    type.createdF,
    date
  ))
}

const isActive = (type, isActive) => {
  if (isActive == null || isActive == undefined) {
    return right(type)
  }

  return boolValid(isActive).map(() => new FilterType(
    type.userId,
    type.playlistId,
    isActive,
    type.address,
    type.sshHost,
    type.createdF,
    type.createdT
  ))
}

const address = (type, address) => {
  if (address == null || address == undefined) {
    return right(type)
  }

  return addressValid(address).map(() => new FilterType(
    type.userId,
    type.playlistId,
    type.isActive,
    address,
    type.sshHost,
    type.createdF,
    type.createdT
  ))
}

const sshHost = (type, sshHost) => {
  if (sshHost == null || sshHost == undefined) {
    return right(type)
  }

  return sshDataValid(sshHost).map(() => new FilterType(
    type.userId,
    type.playlistId,
    type.isActive,
    type.address,
    sshHost,
    type.createdF,
    type.createdT
  ))
}

const playlistId = (type, playlistId) => {
  if (playlistId == null || playlistId == undefined) {
    return right(type)
  }

  return uuidValid(playlistId).map(() => new FilterType(
    type.userId,
    playlistId,
    type.isActive,
    type.address,
    type.sshHost,
    type.createdF,
    type.createdT
  ))
}

export function build(args = {}) {
  return type().chain(
    (type) => createdF(type, args.createdF)
  ).chain(
    (type) => createdT(type, args.createdT)
  ).chain(
    (type) => isActive(type, args.isActive)
  ).chain(
    (type) => address(type, args.address)
  ).chain(
    (type) => sshHost(type, args.sshHost)
  ).chain(
    (type) => playlistId(type, args.playlistId)
  )
}