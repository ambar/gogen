#!/usr/bin/env node

const {run} = require('gogen')
run(
  [__dirname, ...process.argv.slice(2)],
  'Usage: npm init gogen <my-generator>'
)

// OR
// const {create, minimist} = require('gogen')
// create(
//   minimist([__dirname, ...process.argv.slice(2)], {
//     boolean: ['myflag']
//   })
// )
