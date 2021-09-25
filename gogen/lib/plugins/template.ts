import {text} from './modify'
import lodashTemplate from 'lodash.template'

const defaultRender = (content: string, data: object, options?: object) =>
  lodashTemplate(content, options)(data)

const defaultExt = /\.t(\.\w+)?$/

type TemplateOptions = {
  /** The regular expression to match files, file extension will be stripped */
  ext?: RegExp
  /** The regular expression to match files, file extension will not be stripped */
  test?: RegExp
  /** The function to render template, defaults to lodash template */
  render?: typeof defaultRender
  /** Options of template function */
  options?: object
}

/**
 * Render `*.foo.t` or `*.t.foo` to `*.foo` with lodash or you custom template
 */
const template = (
  data: object,
  {
    ext = defaultExt,
    test,
    render = defaultRender,
    options,
  }: TemplateOptions = {}
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

export default template