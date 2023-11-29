import { Entity as BaseEntity } from '../shared/entity';

export class Entity extends BaseEntity {
  #sshPort
  #sshHost
  #sshUser
  #sshPassword
  #address
  #longitude
  #latitude
  #isActive
  
  constructor(
    id,
    sshPort,
    sshHost,
    sshUser,
    sshPassword,
    address,
    longitude,
    latitude,
    isActive,
    created,
    updated
  ) {
    super(id, created, updated)
    this.#sshPort = parseInt(sshPort)
    this.#sshHost = sshHost
    this.#sshUser = sshUser
    this.#sshPassword = sshPassword
    this.#address = address
    this.#longitude = parseFloat(longitude)
    this.#latitude = parseFloat(latitude)
    this.#isActive = isActive
  }

  get sshPort() {
    return this.#sshPort
  }

  get sshHost() {
    return this.#sshHost
  }

  get sshUser() {
    return this.#sshUser
  }

  get sshPassword() {
    return this.#sshPassword
  }

  get address() {
    return this.#address
  }

  get longitude() {
    return this.#longitude
  }

  get latitude() {
    return this.#latitude
  }

  get isActive() {
    return this.#isActive
  }
}