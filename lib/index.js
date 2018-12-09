const minimist = require('minimist')
const create = require('./create')

const run = async (
  args,
  usage = 'Usage: npx gogen <generator> <directory>'
) => {
  const argv = minimist(args)
  if (argv._.length < 2) {
    console.error(usage)
    process.exit()
  }

  try {
    await create(argv)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

exports.minimist = minimist
exports.create = create
exports.run = run
