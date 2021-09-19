const {rename} = require('./modify')

// rename `gitignore` to `.gitignore`, due to https://github.com/npm/npm/issues/1862
module.exports = () =>
  rename(/\/gitignore$/, (file, paths) => {
    // exclude template in initializer, there may be a better way to exclude this, eg. `template/**/template/**/gitignore`
    if (!/(^|\/)templates?\//.test(file.relative)) {
      return {...paths, name: '.gitignore'}
    }
  })
