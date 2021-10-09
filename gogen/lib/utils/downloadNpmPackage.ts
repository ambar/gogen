import {promises as fsp} from 'fs'
import path from 'path'
import createTempDir from './createTempDir'
import canUseYarn from './canUseYarn'
import install from './install'
import shell from './shell'

const npmInit = async (path: string) => {
  const useYarn = await canUseYarn()
  await shell(`${useYarn ? 'yarn' : 'npm'} init -y`, {
    cwd: path,
    stdio: 'ignore',
  })
}

const downloadNpmPackage = async (packagePath: string) => {
  const tempDir = createTempDir({prefix: 'gogen'})
  await npmInit(tempDir)
  await install([packagePath], {cwd: tempDir, silent: true})
  const pkg = JSON.parse(
    (await fsp.readFile(path.resolve(tempDir, 'package.json'))).toString()
  )
  const depName = Object.keys(pkg.dependencies)[0]
  return path.resolve(tempDir, 'node_modules', depName)
}

export default downloadNpmPackage
