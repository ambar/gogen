const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const os = require('os')

const createTempDir = ({prefix} = {}) => {
  const uuid = crypto.randomBytes(16).toString('hex')
  const tempDir = path.resolve(os.tmpdir(), (prefix ? `${prefix}-` : '') + uuid)
  fs.mkdirSync(tempDir)
  return tempDir
}

module.exports = createTempDir
