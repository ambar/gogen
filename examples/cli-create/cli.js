#!/usr/bin/env node

const {create, minimist} = require('gogen')

create(
  minimist(process.argv.slice(2), {
    boolean: ['myflag'],
  })
)
