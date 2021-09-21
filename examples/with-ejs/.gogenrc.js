const ejs = require('ejs')

/**
 * @type {import('gogen').Generator}
 */
module.exports = async (
  {src, dest, pipeline, template, install, gitInit},
  {name}
) => {
  await pipeline(
    src('template/**'),
    template(
      {name, description: 'superb'},
      {ext: /\.ejs$/, render: ejs.render}
    ),
    dest()
  )
  await install()
  await gitInit()
}
