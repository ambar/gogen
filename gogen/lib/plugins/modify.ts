import path from 'path'
import through from 'through2'

const doMatch = (match: any, file: any) => {
  if (match instanceof RegExp) {
    return match.test(file.path)
  } else if (typeof match === 'function') {
    return match(file)
  }
  return false
}

const modify = (match = () => {}, fn: any) =>
  through.obj((file: any, enc: any, cb: any) => {
    if (file.isBuffer() && doMatch(match, file)) {
      file = fn(file) || file
    }
    cb(null, file)
  })

export const text = (match: any, fn: any) =>
  modify(match, (file: any) => {
    const oldContent = String(file.contents)
    const newContent = fn(file, oldContent)
    if (typeof newContent === 'string' && newContent !== oldContent) {
      file.contents = Buffer.from(newContent)
    }
  })

export const json = (
  match = /\.json$/,
  fn: any,
  {finalNewline = true, space = '  '} = {}
) =>
  text(match, (file: any, content: any) => {
    try {
      return (
        JSON.stringify(fn(file, JSON.parse(content)), null, space) +
        (finalNewline ? '\n' : '')
      )
    } catch (e) {
      console.info('JSON Error: ', e.message)
      return content
    }
  })

export const rename = (match: any, fn: any) =>
  modify(match, (file: any) => {
    const {dir, name, ext} = path.parse(file.path)
    const newPaths = fn(file, {dir, name, ext})
    if (newPaths) {
      file.path = path.format(newPaths)
    }
  })

modify.text = text
modify.json = json
modify.rename = rename

export default modify
