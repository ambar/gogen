import fs from 'fs'
import path from 'path'
import stream from 'stream'
import {promisify} from 'util'
import * as vfs from 'vinyl-fs'
import colors from 'kleur'
import prompts from 'prompts'
import {ParsedArgv} from './types'
import shell from './utils/shell'
import canUseYarn from './utils/canUseYarn'
import createTempDir from './utils/createTempDir'
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

const npmInit = async (path: any) => {
  const useYarn = await canUseYarn()
  await shell(`${useYarn ? 'yarn' : 'npm'} init -y`, {
    cwd: path,
    stdio: 'ignore',
  })
}

const partialOptions = (fn: any, partial: any) => (arg: any, options: any) =>
  fn(arg, {...options, ...partial})

const getPathType = (path: any) => {
  if (/^[~./]/.test(path)) {
    return 'local'
  }
  // `npm install <path>` or `yarn add <path>`
  // - https://docs.npmjs.com/cli/install#synopsis
  // - https://yarnpkg.com/lang/en/docs/cli/add/
  return 'npm'
}

const downloadFromNpmPackage = async (packagePath: string) => {
  const tempDir = createTempDir({prefix: 'gogen'})
  await npmInit(tempDir)
  await install([packagePath], {cwd: tempDir, silent: true})
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(tempDir, 'package.json')).toString()
  )
  const depName = Object.keys(pkg.dependencies)[0]
  return path.resolve(tempDir, 'node_modules', depName)
}

// Used to install from non-npm package, such as monorepo or private hosted repo
const downloadFromGitRepo = async (repoPath: any) => {
  // TODO: support hash, subfolder
  const [repo, tagOrBranch] = repoPath.split('#')
  const tempDir = createTempDir({prefix: 'gogen'})
  await shell(
    `git clone --single-branch ${
      tagOrBranch ? `--branch ${tagOrBranch}` : ''
    } ${repo} ${tempDir}`
  )
  // optional install dependencies of rc file?
  // await install([], {cwd: tempDir, silent: true})
  return tempDir
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
      srcPath = await downloadFromGitRepo(generator)
    } else {
      srcPath = await downloadFromNpmPackage(generator)
    }
  }

  // dest path
  const destPath = path.resolve(directory)
  const name = path.basename(destPath)

  // TODO: change cwd to dest path?
  // if (!fs.existsSync(destPath)) { fs.mkdirSync(destPath) }
  // process.chdir(destPath)

  const defaultIgnore = ['!**/node_modules', '!**/node_modules/**']

  // non-stream API
  let extra = {
    install: partialOptions(install, {cwd: destPath}) as typeof install,
    gitInit: partialOptions(gitInit, {cwd: destPath}) as typeof gitInit,
    prompts,
  }

  const api = {
    src: (globs: string[], options: vfs.SrcOptions) =>
      vfs
        .src(defaultIgnore.concat(globs), {cwd: srcPath, dot: true, ...options})
        .pipe(dotgitignore())
        .pipe(packages({name})),
    dest: (folder = destPath, options?: vfs.DestOptions) =>
      vfs.dest(folder, {cwd: srcPath, ...options}),
    // Node v15 has native support (`import {pipeline} from 'stream/promises'`)
    pipeline: promisify(stream.pipeline),
    packages,
    modify,
    template,
    ...extra,
  }

  const context = {
    // TODO: deprecated, remove in next major
    ...extra,
    path: destPath,
    name,
    argv,
  }

  if (Array.isArray(mock) && mock.length) {
    const [mockAPI, mockContext] = mock
    Object.assign(api, mockAPI)
    Object.assign(context, mockContext)
  }

  console.info(`Creating ${colors.green(name)}...`)
  const rcFile = path.resolve(srcPath, '.gogenrc.js')
  const fn = fs.existsSync(rcFile) ? require(rcFile) : defaultRc
  return [fn, api, context] as const
}

export default async (argv: ParsedArgv, opts?: any) => {
  const [fn, api, context] = await loadGenerator(argv, opts)
  return fn(api, context)
}
