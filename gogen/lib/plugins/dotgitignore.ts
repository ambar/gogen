import {rename} from './modify'

/**
 * Rename `gitignore` to `.gitignore`, due to https://github.com/npm/npm/issues/1862
 */
export default () =>
  rename(/\/gitignore$/, (file: any, paths: any) => {
    // exclude template in initializer, there may be a better way to exclude this, eg. `template/**/template/**/gitignore`
    if (!/(^|\/)templates?\//.test(file.relative)) {
      return {...paths, name: '.gitignore'}
    }
  })
