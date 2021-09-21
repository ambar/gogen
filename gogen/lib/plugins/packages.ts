import {json} from './modify'

// modify package.json in app root
export default (patch: any) =>
  json(
    (file: any) => file.relative === 'package.json',
    (file: any, content: any) =>
      typeof patch === 'function'
        ? patch(content, file)
        : Object.assign(content, patch)
  )
