const through = require('through2')
const create = require('./create')

const createMFS = () => {
  const data = {}
  const writer = through.obj((file, enc, next) => {
    if (file.isBuffer()) {
      data[file.relative] = file.contents
    }
    next(null, file)
  })

  return {
    data,
    dest() {
      return writer
    },
    get files() {
      return Object.keys(data).sort()
    },
    readFile(file) {
      return data[file].toString()
    },
  }
}

const mock = async (generator, directory) => {
  const mfs = createMFS()
  const noop = () => {}
  await create(
    {_: [generator, directory]},
    {mock: [{dest: mfs.dest}, {install: noop, gitInit: noop}]}
  )
  return mfs
}

module.exports = mock
