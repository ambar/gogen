import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import os from 'os'

const createTempDir = ({prefix}: any = {}) => {
  const uuid = (crypto as any).randomBytes(16).toString('hex')
  const tempDir = path.resolve(os.tmpdir(), (prefix ? `${prefix}-` : '') + uuid)
  fs.mkdirSync(tempDir)
  return tempDir
}

export default createTempDir
