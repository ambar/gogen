import assert from 'assert'
import {promises as fsp} from 'fs'
import path from 'path'
import {promisify} from 'util'
import stream from 'stream'
import through2 from 'through2'
import {VFile} from './vfile'
import * as fg from 'fast-glob'
import globParent from 'glob-parent'
import colors from 'kleur'
import prompts from 'prompts'
import {ParsedArgv} from './types'
import boolify from './utils/boolify'
import downloadNpmPackage from './utils/downloadNpmPackage'
import downloadGitRepo from './utils/downloadGitRepo'
import gitInit from './utils/gitInit'
import install from './utils/install'
import dotgitignore from './plugins/dotgitignore'
import modify from './plugins/modify'
import packages from './plugins/packages'
import template from './plugins/template'
import defaultRc from './.gogenrc.default'

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

type ReturnPair = Awaited<ReturnType<typeof loadGenerator>>

export type API = ReturnPair[1]
export type Context = Omit<ReturnPair[2], 'install' | 'gitInit' | 'prompts'>

const getPathType = (path: any) => {
  if (/^[~./]/.test(path)) {
    return 'local'
  }
  // `npm install <path>` or `yarn add <path>`
  // - https://docs.npmjs.com/cli/install#synopsis
  // - https://yarnpkg.com/lang/en/docs/cli/add/
  return 'npm'
}

const stringRequired = (v: unknown) =>
  assert.ok(typeof v === 'string' && v !== '')

let defaultIgnore = ['**/node_modules/**', '**/.git', '**/.DS_Store']
async function* globFiles(globs: string[], options: fg.Options) {
  const cwd = options.cwd || process.cwd()
  for (let glob of Array.isArray(globs) ? globs : [globs]) {
    for await (const name of fg.stream(glob, {
      dot: true,
      ignore: defaultIgnore,
      ...options,
      cwd,
    })) {
      let filename = path.resolve(cwd, name as string)
      let file = new VFile()
      Object.assign(file, {
        contents: await fsp.readFile(filename),
        cwd,
        base: path.resolve(cwd, globParent(glob)),
        path: filename,
      })
      yield file
    }
  }
}

export const loadGenerator = async (argv: ParsedArgv, {mock}: any = {}) => {
  const [generator, directory] = argv._

  if (!generator) {
    throw new Error('Generator required.')
  }

  if (!directory) {
    throw new Error('Directory required.')
  }

  const pathType = getPathType(generator)
  let srcPath: string
  if (pathType === 'local') {
    srcPath = path.resolve(generator)
  } else {
    if (argv.clone) {
      srcPath = await downloadGitRepo(generator)
    } else {
      srcPath = await downloadNpmPackage(generator)
    }
  }

  let _path = path.resolve(directory)
  const context = {
    get path() {
      return _path
    },
    set path(v) {
      stringRequired(v)
      _path = path.resolve(v)
    },
    get name() {
      return path.basename(context.path)
    },
    set name(v) {
      stringRequired(v)
      context.path = path.format({...path.parse(context.path), base: v})
    },
    argv,
  }

  // utils, non-stream API
  let extra = {
    install: ((arg, opts) =>
      install(arg, {cwd: context.path, ...opts})) as typeof install,
    gitInit: ((arg, opts) =>
      gitInit(arg, {cwd: context.path, ...opts})) as typeof gitInit,
    prompts,
  }

  const api = {
    src: (globs: string[], options: fg.Options = {}) =>
      stream.Readable.from(globFiles(globs, {cwd: srcPath, ...options}))
        .pipe(dotgitignore())
        .pipe(packages({name: context.name})),
    dest: (folder: string) => {
      folder = folder ?? context.path
      if (folder !== context.path) {
        context.path = folder
      }
      console.info(`Creating ${colors.green(context.name)}...`)
      return through2.obj(async (file: VFile, _enc, next) => {
        let outBase = path.resolve(srcPath, context.path)
        let outPath = path.resolve(outBase, file.relative)
        file.base = outBase
        file.path = outPath
        // TODO: add log
        await fsp.mkdir(file.dirname, {recursive: true})
        await fsp.writeFile(file.path, file.contents as Buffer)
        next(null, file)
      })
    },
    // Node v15 has native support (`import {pipeline} from 'stream/promises'`)
    pipeline: promisify(stream.pipeline),
    packages,
    modify,
    template,
    ...extra,
  }

  if (Array.isArray(mock) && mock.length) {
    const [mockAPI, mockContext] = mock
    Object.assign(api, mockAPI)
    Object.assign(context, mockContext)
  }

  const rcFile = path.resolve(srcPath, '.gogenrc.js')
  const fn = (await boolify(fsp.stat(rcFile))) ? require(rcFile) : defaultRc
  return [fn, api, context] as const
}

export default async (argv: ParsedArgv, opts?: any) => {
  const [fn, api, context] = await loadGenerator(argv, opts)
  return fn(api, context)
}
