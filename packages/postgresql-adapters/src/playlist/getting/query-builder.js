export class QueryBuilder {
  string = `
    SELECT 
      pl.id, pl.name, pl.created, pl.updated
    FROM 
      relations_user_playlist AS rl_u_p
    JOIN 
      playlists AS pl ON pl.id = rl_u_p.playlist_id
  `
  data = []

  whereUserId(filter) {
    if (!filter.userId) {
      return this
    }

    this.data = [...this.data, filter.userId]

    this.string = `${this.string} WHERE rl_u_p.user_id = $${this.data.length}`

    return this
  }

  andWhereName(filter) {
    if (!filter.name) {
      return this
    }

    this.data = [...this.data, `%${filter.name}%`]

    this.string = `${this.string} AND pl.name ILIKE $${this.data.length}`

    return this
  }

  andWhereCreatedF(filter) {
    if (!filter.createdF) {
      return this
    }

    this.data = [...this.data, filter.createdF]

    this.string = `${this.string} AND pl.created >= $${this.data.length}`

    return this
  }

  andWhereCreatedT(filter) {
    if (!filter.createdT) {
      return this
    }

    this.data = [...this.data, filter.createdT]

    this.string = `${this.string} AND pl.created <= $${this.data.length}`

    return this
  }

  orderByName(sort){
    if (!sort.name) {
      return this
    }

    this.string = `${this.string} ORDER BY pl.name ${sort.name}`

    return this
  }

  orderByCreated(sort){
    if (!sort.created) {
      return this
    }

    this.string = `${this.string} ORDER BY pl.created ${sort.created}`

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