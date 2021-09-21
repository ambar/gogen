const {execSync} = require('child_process')
const sh = (cmd) => execSync(cmd).toString().trim()

/**
 * @type {import('gogen').Generator}
 */
module.exports = async (
  {src, dest, pipeline, template, install, gitInit},
  {name}
) => {
  const username = process.env.CI ? 'unknown' : sh('git config user.name')
  await pipeline(src('template/**'), template({name, username}), dest())
  await install()
  await gitInit()
}
