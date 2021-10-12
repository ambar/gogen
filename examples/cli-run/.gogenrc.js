/**
 * @type {import('gogen').Generator}
 */
module.exports = async ({src, dest, pipeline, modify}, {name, argv}) => {
  const {_, ...args} = argv
  await pipeline(
    src('template/**'),
    modify.json(/data/, (_, x) => ({...x, name, args})),
    dest()
  )
}
