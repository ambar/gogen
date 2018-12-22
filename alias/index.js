const path = require('path')
const resolveRelative = path.resolve.bind(null, __dirname)

// alias to reduce bundle size
module.exports = {
  'object.assign': resolveRelative('object.assign'),
  'readable-stream': resolveRelative('readable-stream'),
}
