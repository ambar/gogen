#!/usr/bin/env node

const {run} = require('gogen')

run([__dirname, ...process.argv.slice(2)], 'Usage: npx cli-run <directory>')
