const {text} = require('./modify')
const template = require('lodash.template')

const defaultRender = (content, data, options) =>
  template(content, options)(data)

// render `*.foo.t` to `*.foo` with lodash template
module.exports = (data, {ext = /\.t$/, render = defaultRender, options} = {}) =>
  text(ext, (file, content) => {
    file.path = file.path.replace(ext, '')
    return render(content, data, options)
  })
