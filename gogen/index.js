const isInSourceRepo = require('fs').existsSync(
  require('path').join(__dirname, '.gitkeep')
)

module.exports = require(isInSourceRepo ? './lib' : './dist')
