import mri from 'mri'
import {Argv} from './types'
import create from './create'

const run = async (
  args: string[],
  usage = 'Usage: npx gogen <generator> <directory>'
) => {
  const argv = mri<Argv>(args, {
    alias: {c: 'clone'},
    boolean: ['clone'],
  })
  if (argv._.length < 2) {
    console.error(usage)
    process.exit(1)
  }

  try {
    await create(argv)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export default run
