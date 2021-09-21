import fs from 'fs'
import path from 'path'
import stream from 'stream'
import {promisify} from 'util'
import vfs from 'vinyl-fs'
import colors from 'kleur'
import prompts from 'prompts'
import shell from './utils/shell'
import createTempDir from './utils/createTempDir'
import dotgitignore from './plugins/dotgitignore'
import modify from './plugins/modify'
import packages from './plugins/packages'
import template from './plugins/template'
import defaultRc from './.gogenrc.default'

const boolify = (promise: any) =>
  promise.then(
    (_: any) => true,
    (_: any) => false
  )

const canUseYarn = async () =>
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  /yarn/.test(process.env.npm_execpath) || boolify(shell('yarnpkg --version'))

const install = async (
  deps = [],
  {dev = false, silent = false, cwd, stdio = 'inherit'}: any = {}
) => {
  const useYarn = await canUseYarn()
  if (useYarn) {
    const args = deps.length ? ['add', ...deps, dev && '--dev'] : []
    if (silent) args.push('--silent')
    await shell(`yarn ${args.filter((n) => n).join(' ')}`, {cwd, stdio})
  } else {
    const args = deps.length ? [...deps, dev && '--save-dev'] : []
    if (silent) args.push('--silent')
    await shell(`npm i ${args.filter((n) => n).join(' ')}`, {cwd, stdio})
  }
}

const npmInit = async (path: any) => {
  const useYarn = await canUseYarn()
  await shell(`${useYarn ? 'yarn' : 'npm'} init -y`, {
    cwd: path,
    stdio: 'ignore',
  })
}

const gitInit = async (
  message = 'initial commit',
  {cwd, stdio = 'ignore'}: any = {}
) => {
  const isInsideWorkTree = () =>
    boolify(
      shell('git rev-parse --is-inside-work-tree', {cwd, stdio: 'ignore'})
    )

  const checkIgnore = () =>
    boolify(shell('git check-ignore .', {cwd, stdio: 'ignore'}))

  if ((await isInsideWorkTree()) && !(await checkIgnore())) {
    return
  }

  try {
    await shell('git init', {cwd, stdio})
    await shell('git add .', {cwd, stdio})
    await shell(`git commit -am '${message}'`, {cwd, stdio})
  } catch (e) {
    // no git installed, or no git user/email config
  }
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

const downloadFromNpmPackage = async (packagePath: any) => {
  const tempDir = createTempDir({prefix: 'gogen'})
  await npmInit(tempDir)
  // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
  await install([packagePath], {cwd: tempDir, silent: true})
  const pkg = JSON.parse(fs.readFileSync(path.resolve(tempDir, 'package.json')))
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'create'.
const create = async (argv: any, {mock}: any = {}) => {
  const [generator, directory] = argv._

  if (!generator) {
    throw new Error('Generator required.')
  }

  if (!directory) {
    throw new Error('Directory required.')
  }

  const pathType = getPathType(generator)
  let srcPath: any
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
    install: partialOptions(install, {cwd: destPath}),
    gitInit: partialOptions(gitInit, {cwd: destPath}),
    prompts,
  }

  const api = {
    src: (globs: any, options: any) =>
      vfs
        .src(defaultIgnore.concat(globs), {cwd: srcPath, dot: true, ...options})
        .pipe(dotgitignore())
        .pipe(packages({name})),
    dest: (directory = destPath, options: any) =>
      vfs.dest(directory, {cwd: srcPath, ...options}),
    // promisify pipeline, Node v15 has native support
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
  const boostrap = fs.existsSync(rcFile)
    ? eval('require')(rcFile) // hack to fix webpack error: `Critical dependency: the request of a dependency is an expression`
    : defaultRc
  await boostrap(api, context)
}

export default create
