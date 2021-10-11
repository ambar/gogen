const {join} = require('path')

module.exports = async ({src, dest, pipeline}, ctx) => {
  await pipeline(src('template/**'), dest(join(ctx.path, 'subfolder')))
}
