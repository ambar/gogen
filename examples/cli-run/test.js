const path = require('path')
const fs = require('fs').promises
const {exec} = require('child_process')
const {promisify} = require('util')
const {mock} = require('gogen')

const command = promisify(exec)
const resolveDir = path.resolve.bind(null, __dirname)
const cli = resolveDir('cli.js')
const outdir = resolveDir('dist')
const readJson = async (file) =>
  JSON.parse(await fs.readFile(resolveDir(outdir, file)))

beforeEach(async () => {
  fs.rm
    ? await fs.rm(outdir, {recursive: true, force: true})
    : // remove in Node v14
      await fs.rmdir(outdir, {recursive: true}).catch(() => {})
})

test('basic', async () => {
  const {files, readFile} = await mock(__dirname, 'mylib')
  expect(files).toMatchInlineSnapshot(`
Array [
  "data.json",
  "package.json",
]
`)
})

test('cli args - post', async () => {
  await command(`${cli} ${outdir} --no-install`)
  expect((await readJson('data.json')).args).toMatchInlineSnapshot(`
Object {
  "install": false,
}
`)
})

test('cli args - pre', async () => {
  await command(`${cli} --no-install ${outdir}`)
  expect((await readJson('data.json')).args).toMatchInlineSnapshot(`
Object {
  "install": false,
}
`)
})
