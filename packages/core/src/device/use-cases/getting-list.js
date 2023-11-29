import { merge } from "@sweet-monads/either";
import { build as buildFilter } from '../types/builders/filter';
import { build as buildSort } from '../types/builders/sort';
import { build as buildPagi } from '../../shared/types/builders/pagi';
import { Filter as FilterType } from '../types/filter';

export class GettingList {
  #authorization
  #getterListDevice

  constructor(
    authorization,
    getterListDevice
  ) {
    this.#authorization = authorization
    this.#getterListDevice = getterListDevice
  }

  async get(args = {}) {
    const p_0 = this.#authorization.auth({token: args.token})

    return p_0.then((either) => either.chain((user) => {
      
        const either_0 = buildPagi(args.pagi)
        const either_1 = buildFilter(args.filter)
        const either_2 = buildSort(args.sort)

        return merge([either_0, either_1, either_2]).chain(
          ([pagi, filter, sort]) => {
            
            const newFilter = new FilterType(
              user.id,
              filter.playlistId,
              filter.isActive,
              filter.address,
              filter.sshHost,
              filter.createdF,
              filter.createdT
            )

            return this.#getterListDevice.get(newFilter, sort, pagi)
          }
        )
      })
    )
  }
}