const fs = require('fs')
const path = require('path')
const stream = require('stream')
const {promisify} = require('util')
const vfs = require('vinyl-fs')
const colors = require('kleur')
const prompts = require('prompts')
const shell = require('./utils/shell')
const dotgitignore = require('./plugins/dotgitignore')
const modify = require('./plugins/modify')
const packages = require('./plugins/packages')
const template = require('./plugins/template')
const defaultRc = require('./.gogenrc.default')

const boolify = (promise) =>
  promise.then(
    (_) => true,
    (_) => false
  )

const canUseYarn = async () =>
  /yarn/.test(process.env.npm_execpath) || boolify(shell('yarnpkg --version'))

const install = async (
  deps = [],
  {dev = false, silent = false, cwd, stdio = 'inherit'} = {}
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

const npmInit = async (path) => {
  const useYarn = await canUseYarn()
  await shell(`${useYarn ? 'yarn' : 'npm'} init -y`, {
    cwd: path,
    stdio: 'ignore',
  })
}

const createTempDir = ({prefix} = {}) => {
  const crypto = require('crypto')
  const os = require('os')
  const uuid = crypto.randomBytes(16).toString('hex')
  const tempDir = path.resolve(os.tmpdir(), (prefix ? `${prefix}-` : '') + uuid)
  fs.mkdirSync(tempDir)
  return tempDir
}

const gitInit = async (
  message = 'initial commit',
  {cwd, stdio = 'ignore'} = {}
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

const partialOptions = (fn, partial) => (arg, options) =>
  fn(arg, {...options, ...partial})

const getPathType = (path) => {
  if (/^[~./]/.test(path)) {
    return 'local'
  }
  // `npm install <path>` or `yarn add <path>`
  // - https://docs.npmjs.com/cli/install#synopsis
  // - https://yarnpkg.com/lang/en/docs/cli/add/
  return 'npm'
}

const downloadFromNpmPackage = async (packagePath) => {
  const tempDir = createTempDir({prefix: 'gogen'})
  await npmInit(tempDir)
  await install([packagePath], {cwd: tempDir, silent: true})
  const pkg = JSON.parse(fs.readFileSync(path.resolve(tempDir, 'package.json')))
  const depName = Object.keys(pkg.dependencies)[0]
  return path.resolve(tempDir, 'node_modules', depName)
}

// Used to install from non-npm package, such as monorepo or private hosted repo
const downloadFromGitRepo = async (repoPath) => {
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

const create = async (argv, {mock} = {}) => {
  const [generator, directory] = argv._

  if (!generator) {
    throw new Error('Generator required.')
  }

  if (!directory) {
    throw new Error('Directory required.')
  }

  const pathType = getPathType(generator)
  let srcPath
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

  const go = {
    src: (globs, options) =>
      vfs
        .src(defaultIgnore.concat(globs), {cwd: srcPath, dot: true, ...options})
        .pipe(dotgitignore())
        .pipe(packages({name})),
    dest: (directory = destPath, options) =>
      vfs.dest(directory, {cwd: srcPath, ...options}),
    // promisify pipeline, Node v15 has native support
    pipeline: promisify(stream.pipeline),
    packages,
    modify,
    template,
  }

  const context = {
    path: destPath,
    name,
    install: partialOptions(install, {cwd: destPath}),
    gitInit: partialOptions(gitInit, {cwd: destPath}),
    prompts,
    argv,
  }

  if (Array.isArray(mock) && mock.length) {
    const [mockGo, mockContext] = mock
    Object.assign(go, mockGo)
    Object.assign(context, mockContext)
  }

  console.info(`Creating ${colors.green(name)}...`)
  const rcFile = path.resolve(srcPath, '.gogenrc.js')
  const boostrap = fs.existsSync(rcFile)
    ? eval('require')(rcFile) // hack to fix webpack error: `Critical dependency: the request of a dependency is an expression`
    : defaultRc
  await boostrap(go, context)
}

module.exports = create
