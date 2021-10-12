#!/usr/bin/env node

const {create, minimist} = require('gogen')

const run = async () => {
  const argv = minimist([__dirname, ...process.argv.slice(2)], {
    alias: {h: 'help'},
    boolean: ['help', 'install'],
  })
  if (argv.help || argv._.length < 2) {
    console.info(`Usage: npx cli-create <directory>`)
    return
  }
  await create(argv)
}

run().catch(console.error)
