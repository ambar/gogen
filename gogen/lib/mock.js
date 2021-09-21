const through = require('through2')
const prompts = require('prompts')
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

const mock = async (generator, directory, {answers = {}, context} = {}) => {
  const mfs = createMFS()
  prompts.inject(answers)
  const noop = () => {}
  const extra = {install: noop, gitInit: noop}
  await create(
    {_: [generator, directory]},
    {
      mock: [
        {...extra, dest: mfs.dest},
        {...extra, ...context},
      ],
    }
  )
  return mfs
}

module.exports = mock
