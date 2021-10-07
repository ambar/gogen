import fs from 'fs'
import path from 'path'
import {sync} from 'glob'
import {mock, run} from '../lib'
import createTempDir from '../lib/utils/createTempDir'

describe('mock', () => {
  test('should throw errors', async () => {
    await expect(mock('', '')).rejects.toThrow()
    await expect(mock('foo', '')).rejects.toThrow()
    await expect(mock('', 'foo')).rejects.toThrow()
  })

  test('mock ok', async () => {
    const generator = path.resolve(__dirname, 'fixtures/test-basic')
    const {files, readFile} = await mock(generator, 'mylib')
    expect(files).toMatchInlineSnapshot(`
Array [
  ".gitignore",
  "README.md",
  "index.js",
  "package.json",
]
`)
    expect(readFile('package.json')).toMatch(/mylib/)
  })
})

describe('integration', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(code)
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('run error', async () => {
    await expect(run([__dirname], 'usage')).rejects.toThrow(/1/)
    await expect(run([__dirname, ''], 'usage')).rejects.toThrow(/1/)
  })

  test('run ok from local', async () => {
    const dist = createTempDir({prefix: 'gogen'})
    const generator = path.resolve(__dirname, 'fixtures/test-basic')
    await run([generator, dist])
    const pkg = JSON.parse(fs.readFileSync(path.resolve(dist, 'package.json')))
    expect(pkg).toMatchObject({
      description: 'superb',
      devDependencies: {olt: expect.anything()},
    })
    const files = sync('**', {
      cwd: dist,
      dot: true,
      ignore: ['.git/*/**', '.yarn/**'],
    }).sort()
    expect(files).toMatchInlineSnapshot(`
Array [
  ".git",
  ".gitignore",
  ".pnp.cjs",
  "README.md",
  "index.js",
  "package.json",
  "yarn.lock",
]
`)
  })
})
