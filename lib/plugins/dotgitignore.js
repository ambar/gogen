const {rename} = require('./modify')

// rename `gitignore` to `.gitignore`, due to https://github.com/npm/npm/issues/1862
module.exports = () =>
  rename(/\/gitignore$/, (file, paths) => {
    // there may be a better way to exclude */template/gitignore
    if (!/\/?template$/.test(paths.dirname)) {
      return {...paths, basename: '.gitignore'}
    }
  })
