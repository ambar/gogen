import through from 'through2'
import prompts from 'prompts'
import create from './create'

const createMFS = () => {
  const data = {}
  const writer = through.obj((file: any, enc: any, next: any) => {
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
    readFile(file: any) {
      return data[file].toString()
    },
  }
}

const mock = async (
  generator: any,
  directory: any,
  {answers = {}, context}: any = {}
) => {
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

export default mock
