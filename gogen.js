#!/usr/bin/env node

const {GOGEN_ENV} = process.env
const isInSourceRepo = GOGEN_ENV
  ? GOGEN_ENV === 'dev'
  : require('fs').existsSync(require('path').join(__dirname, '.gitignore'))

require(isInSourceRepo ? './lib' : './dist').run(process.argv.slice(2))
