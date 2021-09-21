import boolify from './boolify'
import shell from './shell'

const canUseYarn = async () =>
  /yarn/.test(process.env.npm_execpath as string) ||
  boolify(shell('yarnpkg --version'))

export default canUseYarn
