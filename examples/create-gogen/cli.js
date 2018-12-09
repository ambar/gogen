#!/usr/bin/env node

// TODO: use linked package
const {run} = require(process.env.GOGEN_ENV === 'dev' ? '../../lib' : 'gogen')
run(
  [__dirname, ...process.argv.slice(2)],
  'Usage: npm init gogen <my-generator>'
)

// or use `create`:
// const {create} = require('gogen')
// gogen.create({
//   _: [__dirname, ...process.argv.slice(2)],
// })
