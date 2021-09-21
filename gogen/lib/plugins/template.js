const {text} = require('./modify')
const template = require('lodash.template')

const defaultRender = (content, data, options) =>
  template(content, options)(data)

const defaultExt = /\.t(\.\w+)?$/

/**
 * render `*.foo.t` or `*.t.foo` to `*.foo` with lodash template
 */
module.exports = (
  data,
  {ext = defaultExt, test, render = defaultRender, options} = {}
) =>
  text(test || ext, (file, content) => {
    if (!test && ext) {
      file.path = file.path.replace(
        ext,
        ext === defaultExt && file.path.match(ext).length > 1 ? '$1' : ''
      )
    }
    return render(content, data, options)
  })
