import through from 'through2'
import prompts from 'prompts'
import create from './create'

const createMFS = () => {
  const data: Record<string, string> = {}
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
    readFile(file: string) {
      return data[file].toString()
    },
  }
}

const mock = async (
  generator: string,
  directory: string,
  {answers = {}, api, context}: any = {}
) => {
  const mfs = createMFS()
  prompts.inject(answers)
  const noop = async () => {}
  await create(
    {_: [generator, directory]},
    {
      mock: [
        {install: noop, gitInit: noop,...api, dest: mfs.dest},
        {...context},
      ],
    }
  )
  return mfs
}

export default mock
