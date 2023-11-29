import fs from 'fs';
import path from 'path';
import { right, left } from "@sweet-monads/either";
import { Error } from '../../shared/types/error';

const extensions = {
  ".png": true,
  ".gif": true,
  ".jpg": true,
  ".jpeg": true,
  ".svg": true
}

export function valid(p = "") {
  if (!fs.existsSync(p)) {
    return left(new Error("Не удалось получить размер файла"))
  }

  const stats = fs.statSync(p)

  if (!stats.isFile()) {
    return left(new Error("Не удалось получить размер файла"))
  }

  if (!stats.size) {
    return left(new Error("Пустой файл"))
  }

  const extname = path.extname(path.basename(p).toLowerCase())

  if (!extensions[extname]) {
    return left(new Error("Не валидное расширение файла"))
  }

  return right(stats)
}