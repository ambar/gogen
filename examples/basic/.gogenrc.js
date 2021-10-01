/**
 * @type {import('gogen').Generator}
 */
module.exports = async (
  {src, dest, pipeline, packages, template, install, gitInit},
  {name}
) => {
  await pipeline(
    src('template/**'),
    packages({description: 'superb'}),
    template({name, description: 'My [gogen](#) project'}),
    dest()
  )
  // yarn v2+ cannot run, because it thinks the `dist` folder is also part of this monorepo
  await install(['olt'], {dev: true, silent: true}).catch(console.warn)
  await gitInit()
}
