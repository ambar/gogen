/**
 * @type {import('gogen').Generator}
 */
module.exports = async (
  {src, dest, pipeline, template},
  {name}
) => {
  await pipeline(
    src('template/**'),
    template({name, description: 'My [gogen](#) project'}),
    dest()
  )
}
