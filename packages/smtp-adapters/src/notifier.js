import { right } from "@sweet-monads/either";
import nodemailer from 'nodemailer';

export class Notifier {
  #host
  #port
  #secure
  #user
  #pass

  #mailer

  constructor(
    host,
    port,
    secure,
    user,
    pass,
  ) {
    this.#host = host
    this.#port = port
    this.#secure = secure
    this.#user = user
    this.#pass = pass

    this.#mailer = nodemailer.createTransport({
      host: this.#host,
      port: this.#port,
      secure: this.#secure,
      auth: {
        user: this.#user,
        pass: this.#pass,
      },
    })
  }

  async notify(args = {}) {
    await this.#mailer.sendMail({
      from: args.from,
      to: args.to,
      subject: args.subject,
      text: args.message,
      html: ``,
    })

    return right(true)
  }
}