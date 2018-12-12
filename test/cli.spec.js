const fs = require('fs')
const path = require('path')
const globby = require('globby')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const shell = require('../lib/utils/shell')
const {create} = require('../lib')

const resolveRoot = path.resolve.bind(null, process.cwd())

const createTemp = name => {
  const tempDir = path.resolve(__dirname, 'tmp', name)
  rimraf.sync(tempDir)
  mkdirp.sync(tempDir)
  return tempDir
}

const getFiles = async base =>
  (await globby([`**`], {
    cwd: base,
    dot: true,
    gitignore: true,
    ignore: [
      '**/.git',
      '**/node_modules',
      'yarn.lock' /* travis `Lockfile not saved` */,
    ],
  })).sort()

const readJson = file => JSON.parse(fs.readFileSync(file))

const run = (generator, name) => create({_: [generator, name]})

const runInitializer = name =>
  shell(`node ${resolveRoot('examples/create-gogen/cli')} ${name}`, {
    env: {GOGEN_ENV: 'dev'},
  })

describe('gogen', () => {
  const tmpCwd = createTemp('gogen')
  const resolveTmp = path.resolve.bind(null, tmpCwd)

  beforeAll(async () => {
    // install workspace deps
    await shell('yarn --silent', {cwd: resolveRoot('examples')})
  })

  beforeEach(() => {
    // set generator cwd
    process.chdir(tmpCwd)
    rimraf.sync(`${tmpCwd}/*`)
  })

  it('should throw errors', async () => {
    await expect(run()).rejects.toThrow()
    await expect(run('foo', '')).rejects.toThrow()
    await expect(run('', 'foo')).rejects.toThrow()
  })

  it('should run generator correctly', async () => {
    await run(resolveRoot('examples/basic'), 'mylib')
    const files = await getFiles(resolveTmp('mylib/'))
    expect(files).toMatchSnapshot()

    // patches package.json
    expect(readJson(resolveTmp('mylib/package.json'))).toMatchObject({
      name: 'mylib',
      description: 'superb',
    })
    expect(readJson(resolveTmp('mylib/subpackage/package.json'))).toMatchObject(
      {
        name: 'subpackage',
        license: 'MIT',
      }
    )

    // re-run
    await expect(
      run(resolveRoot('examples/basic'), 'mylib')
    ).resolves.not.toThrow()
  })

  it('should run `with-ejs` correctly', async () => {
    await run(resolveRoot('examples/with-ejs'), 'mylib')
    const files = await getFiles(resolveTmp('mylib'))
    expect(files).toMatchSnapshot()
    expect(readJson(resolveTmp('mylib/package.json'))).toMatchObject({
      description: 'superb',
    })
  })

  it('should run `without-gogenrc` correctly', async () => {
    await run(resolveRoot('examples/without-gogenrc'), 'mylib')
    const files = await getFiles(resolveTmp('mylib'))
    expect(files).toMatchSnapshot()
  })

  it('should run initializer correctly', async () => {
    await runInitializer('mylib')
    const files = await getFiles(resolveTmp('mylib'))
    expect(files).toMatchSnapshot()
  })
})
