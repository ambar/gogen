#!/usr/bin/env node

const {run} = require('gogen')
run(
  [__dirname, ...process.argv.slice(2)],
  'Usage: npm init gogen <my-generator>'
)

// or use `create`:
// const {create} = require('gogen')
// gogen.create({
//   _: [__dirname, ...process.argv.slice(2)],
// })
