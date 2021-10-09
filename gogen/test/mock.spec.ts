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
  "README.md",
  "index.js",
  "package.json",
]
`)
  expect(readFile('package.json')).toMatch(/mylib/)
})
