const path = require('path')
const through = require('through2')

const doMatch = (match, file) => {
  if (match instanceof RegExp) {
    return match.test(file.path)
  } else if (typeof match === 'function') {
    return match(file)
  }
  return false
}

const modify = (match = () => {}, fn) =>
  through.obj((file, enc, cb) => {
    if (file.isBuffer() && doMatch(match, file)) {
      file = fn(file) || file
    }
    cb(null, file)
  })

const text = (match, fn) =>
  modify(match, (file) => {
    const oldContent = String(file.contents)
    const newContent = fn(file, oldContent)
    if (typeof newContent === 'string' && newContent !== oldContent) {
      file.contents = Buffer.from(newContent)
    }
  })

const json = (
  match = /\.json$/,
  fn,
  {finalNewline = true, space = '  '} = {}
) =>
  text(match, (file, content) => {
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

const rename = (match, fn) =>
  modify(match, (file) => {
    const {dir, name, ext} = path.parse(file.path)
    const newPaths = fn(file, {dir, name, ext})
    if (newPaths) {
      file.path = path.format(newPaths)
    }
  })

module.exports = modify
modify.text = text
modify.json = json
modify.rename = rename
