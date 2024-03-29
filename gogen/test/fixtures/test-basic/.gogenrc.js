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
  await install(['olt'], {dev: true, silent: true})
  await gitInit()
}
