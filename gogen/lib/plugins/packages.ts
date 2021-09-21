import {VFile} from '../types'
import {json} from './modify'

/**
 * Modify `package.json` in app root
 */
const packages = (patch: object | ((content: object, file: VFile) => object)) =>
  json(
    (file) => file.relative === 'package.json',
    (file, content) =>
      typeof patch === 'function'
        ? patch(content, file)
        : Object.assign(content, patch)
  )

export default packages
