module.exports = async (
  {src, dest, pipeline, template, install, gitInit},
  context
) => {
  context.name = `prefix-${context.name}`
  await pipeline(
    src('template/**'),
    template({name: context.name, description: 'My [gogen](#) project'}),
    dest()
  )
  await install(['olt'], {dev: true, silent: true})
  await gitInit()
}
