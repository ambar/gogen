import path from 'path'
import through from 'through2'
import {VFile} from '../types'

type Match = RegExp | ((file: VFile) => boolean)

const doMatch = (match: Match, file: VFile) => {
  if (match instanceof RegExp) {
    return match.test(file.path)
  } else if (typeof match === 'function') {
    return match(file)
  }
  return false
}

/**
 * Modify files that match the pattern
 */
const modify = (
  match: Match = () => false,
  fn: (file: VFile) => void | VFile
) =>
  through.obj((file, enc, cb) => {
    if (file.isBuffer() && doMatch(match, file)) {
      file = fn(file as VFile) || file
    }
    cb(null, file)
  })

/**
 * Modify text files that match the pattern
 */
export const text = (
  match: Match,
  fn: (file: VFile, content: string) => string
) =>
  modify(match, (file) => {
    const oldContent = String(file.contents)
    const newContent = fn(file, oldContent)
    if (typeof newContent === 'string' && newContent !== oldContent) {
      file.contents = Buffer.from(newContent)
    }
  })

/**
 * Modify json files that match the pattern
 */
export const json = (
  match: Match = /\.json$/,
  fn: (file: VFile, content: object) => object,
  {finalNewline = true, space = '  '} = {}
) =>
  text(match, (file, content) => {
    try {
      return (
        JSON.stringify(fn(file, JSON.parse(content)), null, space) +
        (finalNewline ? '\n' : '')
      )
    } catch (e) {
      console.info('JSON Error: ', (e as Error).message)
      return content
    }
  })

type PathInfo = Pick<path.ParsedPath, 'dir' | 'name' | 'ext'>
/**
 * Rename files that match the pattern
 */
export const rename = (
  match: Match,
  fn: (file: VFile, info: PathInfo) => void | PathInfo
) =>
  modify(match, (file) => {
    const {dir, name, ext} = path.parse(file.path)
    const newPaths = fn(file, {dir, name, ext})
    if (newPaths) {
      file.path = path.format(newPaths)
    }
  })

modify.text = text
modify.json = json
modify.rename = rename

export default modify
