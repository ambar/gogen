#!/usr/bin/env node

const isInSourceRepo = require('fs').existsSync(
  require('path').join(__dirname, '.gitignore')
)

require(isInSourceRepo ? './lib' : './dist').run(process.argv.slice(2))
