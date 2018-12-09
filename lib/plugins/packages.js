const {json} = require('./modify')

// modify package.json in app root
module.exports = patch =>
  json(
    file => file.relative === 'package.json',
    (file, content) =>
      typeof patch === 'function'
        ? patch(content, file)
        : Object.assign(content, patch)
  )
