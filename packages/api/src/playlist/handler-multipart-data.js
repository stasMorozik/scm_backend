import fs from 'fs';

export const handlerMultipartData = async function (request) {
  const contents = {}

  const deleteContents = {}

  let name

  for await (let part of request.parts()) {
    if (part.type == "field" && part.fieldname && part.fieldname == "name") {
      name = part.value
      continue
    }

    if (part.type == "field" && part.fieldname && part.fieldname == "deleteContents") {
      deleteContents[part.value] = true
      continue
    }

    if (!contents[part.filename ? part.filename : part.fieldname]) {
      contents[part.filename ? part.filename : part.fieldname] = {}
    }

    if (part.type === "file") {
      await fs.promises.writeFile(`/tmp/${part.filename}`, part.file)

      contents[part.filename].file = {
        path: `/tmp/${part.filename}`
      }
    }

    if (part.type == "field") {
      contents[part.fieldname].displayDuration = part.value
    }
  }

  return [contents, deleteContents, name]
}