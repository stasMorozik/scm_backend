
export class Filter {
  #userId
  #playlistId  
  #isActive
  #address    
  #sshHost   
  #createdF  
  #createdT
  
  constructor(
    userId,
    playlistId,
    isActive,
    address,    
    sshHost,   
    createdF,  
    createdT
  ) {
    this.#userId = userId
    this.#playlistId = playlistId
    this.#isActive = isActive
    this.#address = address
    this.#sshHost = sshHost
    this.#createdF = createdF
    this.#createdT = createdT
  }

  get userId() {
    return this.#userId
  }

  get playlistId() {
    return this.#playlistId
  }

  get isActive() {
    return this.#isActive
  }

  get address() {
    return this.#address
  }

  get sshHost() {
    return this.#sshHost
  }

  get createdF() {
    return this.#createdF
  }

  get createdT() {
    return this.#createdT
  }
}