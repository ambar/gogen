import minimist from 'mri'
import create from './create'
import mock from './mock'

export const run = async (
  args: any,
  usage = 'Usage: npx gogen <generator> <directory>'
) => {
  const argv = minimist(args, {
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

export {minimist}
export {create}
export {mock}
