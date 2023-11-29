import { build } from '../builder';

export class Creating {
  #transformer
  #notifier

  constructor(
    transformer,
    notifier
  ){
    this.#transformer = transformer
    this.#notifier = notifier
  }

  async create(args = {needle: ""}) {
    const either = build(args)

    const p_0 = either.asyncChain(
      (entity) => this.#transformer.transform(entity)
    )

    return p_0.then(
      (either) => either.chain(
        () => this.#notifier.notify({
          to: args.needle,
          from: "system_content_manager@dev.org",
          subject: "Подтверждение адреса электронной почты",
          message: `Ваш код подтверждения: ${either.value.code}`
        }) 
      )
    )
  }
}