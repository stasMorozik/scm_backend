export function jsonStringifyContent(contents) {
  const content = contents.map((c) => {
    return {
      id: c.id,
      display_duration: c.displayDuration,
      file: {
        id: c.file.id,
        size: c.file.size,
        url: c.file.url,
        path: c.file.path,
        created: c.file.created,
        updated: c.file.updated
      },
      created: c.created,
      updated: c.updated
    }
  })

  return JSON.stringify(content)
}