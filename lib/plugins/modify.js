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
  modify(match, file => {
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
  modify(match, file => {
    const oldPaths = {
      base: file.base,
      relative: file.relative,
      dirname: path.dirname(file.relative),
      basename: path.basename(file.relative),
      extname: path.extname(file.relative),
    }
    const newPaths = fn(file, oldPaths)
    if (newPaths) {
      file.path = path.join(
        file.base,
        newPaths.dirname,
        newPaths.basename,
        newPaths.extname
      )
    }
  })

module.exports = modify
modify.text = text
modify.json = json
modify.rename = rename
