import path from 'path'
import mock from '../lib/mock'

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
  ".rc",
  ".rc.js",
  "README.md",
  "index.js",
  "package.json",
]
`)
  expect(JSON.parse(readFile('package.json'))).toMatchObject({
    name: 'mylib',
  })
})

test('change context', async () => {
  const generator = path.resolve(__dirname, 'fixtures/change-context')
  const {files, readFile} = await mock(generator, 'mylib')
  expect(files).toMatchInlineSnapshot(`
Array [
  "README.md",
  "package.json",
]
`)
  expect(JSON.parse(readFile('package.json'))).toMatchObject({
    name: 'prefix-mylib',
  })
})
