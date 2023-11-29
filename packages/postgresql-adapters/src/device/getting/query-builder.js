export class QueryBuilder {
  string = `
    SELECT 
      d.id, d.address, d.ssh_host, d.is_active, d.created, d.updated
    FROM 
      relations_user_device AS rl_u_d
    JOIN 
      devices AS d ON d.id = rl_u_d.device_id
  `
  data = []

  whereUserId(filter) {
    if (!filter.userId) {
      return this
    }

    this.data = [...this.data, filter.userId]

    this.string = `${this.string} WHERE rl_u_d.user_id = $${this.data.length}`

    return this
  }

  andWhereAddress(filter) {
    if (!filter.address) {
      return this
    }

    this.data = [...this.data, `%${filter.address}%`]

    this.string = `${this.string} AND d.address ILIKE $${this.data.length}`

    return this
  }

  andWhereSshHost(filter) {
    if (!filter.sshHost) {
      return this
    }

    this.data = [...this.data, `%${filter.sshHost}%`]

    this.string = `${this.string} AND d.ssh_host ILIKE $${this.data.length}`

    return this
  }

  andWhereIsActive(filter) {
    if (!filter.isActive) {
      return this
    }

    this.data = [...this.data, filter.isActive]

    this.string = `${this.string} AND d.is_active = $${this.data.length}`

    return this
  }

  andWhereCreatedF(filter) {
    if (!filter.createdF) {
      return this
    }

    this.data = [...this.data, filter.createdF]

    this.string = `${this.string} AND d.created >= $${this.data.length}`

    return this
  }

  andWhereCreatedT(filter) {
    if (!filter.createdT) {
      return this
    }

    this.data = [...this.data, filter.createdT]

    this.string = `${this.string} AND d.created <= $${this.data.length}`

    return this
  }

  orderByIsActive(sort) {
    if (!sort.isActive) {
      return this
    }

    this.string = `${this.string} ORDER BY d.is_active ${sort.isActive}`

    return this
  }

  orderByCreated(sort){
    if (!sort.created) {
      return this
    }

    this.string = `${this.string} ORDER BY d.created ${sort.created}`

    return this
  }

  limitOffset(pagi) {
    let offset

    if (pagi.page == 1) {
      offset = 0
    }

    if (pagi.page > 1) {
      offset = pagi.limit * (pagi.page-1)
    }

    this.data = [...this.data, pagi.limit]

    this.string = `${this.string} LIMIT $${this.data.length}`

    this.data = [...this.data, offset]

    this.string = `${this.string} OFFSET $${this.data.length}`

    return this
  }
}