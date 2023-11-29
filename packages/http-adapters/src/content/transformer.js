import { Buffer } from 'node:buffer';
import { right, left } from "@sweet-monads/either";
import { ContentEntity, Error } from 'core';
import fs from 'fs';

export class Transformer {
  #headers

  constructor(
    user, 
    password
  ){
    this.#headers = {
      "Authorization": `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
    }
  }

  async transform(contents = []) {
    if (!Array.isArray(contents)) {
      return left(
        new Error("Не валидные данные для занесения файлов контента в хранилище")
      )
    }

    for (let content of contents) {
      if ((content instanceof ContentEntity) == false) {
        return left(
          new Error("Не валидные данные для занесения файлов контента в хранилище")
        )
      }
    }

    for (let content of contents) {
      if (!fs.existsSync(content.file.path)) {
        continue;
      }

      const bufferContent = await fs.promises.readFile(content.file.path)

      const options = {
        body: bufferContent, 
        method: 'PUT',
        headers: this.#headers
      }
      
      const response = await fetch(content.file.url, options)
        
      if ((response.status >= 200 && response.status <= 299) == false) {
        return left(new Error("Не удалось отправить файл контента"))
      }
    }

    return right(true)
  }
}