import { valid } from '../../shared/validators/email';
import { confirm } from '../methods/confirm';

export class Confirming {
  #transformer
  #getter

  constructor(
    transformer,
    getter
  ){
    this.#transformer = transformer
    this.#getter = getter
  }

  async confirm(args = {needle: "", code: 0}) {
    const p_0 = valid(args.needle).asyncChain(
      () => this.#getter.get(args.needle)
    )
    
    return p_0.then(
      (either) => either.chain(
        (entity) => confirm(args.code, entity)
      ).chain(
        (entity) => this.#transformer.transform(entity)
      )
    )
  }
}