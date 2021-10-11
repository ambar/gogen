import fs from 'fs'
import path from 'path'
import glob from 'glob'
import run from '../lib/run'
import createTempDir from '../lib/utils/createTempDir'

jest.setTimeout(10 * 1000)

const globDir = (dir) =>
  glob
    .sync('**', {
      cwd: dir,
      dot: true,
      ignore: ['.git/*/**', '.yarn/**'],
    })
    .sort()

test('run error', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(code)
  })
  await expect(run([__dirname], 'usage')).rejects.toThrow(/1/)
  await expect(run([__dirname, ''], 'usage')).rejects.toThrow(/1/)
  jest.restoreAllMocks()
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
  const files = globDir(dist)
  expect(files).toMatchInlineSnapshot(`
Array [
  ".git",
  ".gitignore",
  ".pnp.cjs",
  ".rc",
  ".rc.js",
  "README.md",
  "index.js",
  "package.json",
  "yarn.lock",
]
`)
})

test('change dest', async () => {
  const dist = createTempDir({prefix: 'gogen'})
  const generator = path.resolve(__dirname, 'fixtures/change-dest')
  await run([generator, dist])
  const files = globDir(dist)
  expect(files).toMatchInlineSnapshot(`
Array [
  "subfolder",
  "subfolder/README.md.t",
  "subfolder/package.json",
]
`)
})
