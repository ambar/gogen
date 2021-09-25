module.exports = async ({src, dest, pipeline, install, gitInit}) => {
  await pipeline(src('template/**'), dest())
  await install()
  await gitInit()
}
