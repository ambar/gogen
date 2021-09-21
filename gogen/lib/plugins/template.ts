import {text} from './modify'
import template from 'lodash.template'

const defaultRender = (content: any, data: any, options: any) =>
  template(content, options, undefined)(data)

const defaultExt = /\.t(\.\w+)?$/

/**
 * render `*.foo.t` or `*.t.foo` to `*.foo` with lodash template
 */
export default (
  data: any,
  {ext = defaultExt, test, render = defaultRender, options}: any = {}
) =>
  text(test || ext, (file: any, content: any) => {
    if (!test && ext) {
      file.path = file.path.replace(
        ext,
        ext === defaultExt && file.path.match(ext).length > 1 ? '$1' : ''
      )
    }
    return render(content, data, options)
  })
