const {mock} = require('gogen')

test('basic', async () => {
  const {files, readFile} = await mock(__dirname, 'mylib')
  expect(files).toMatchInlineSnapshot(`
Array [
  ".gitignore",
  "README.md",
  "index.js",
  "package.json",
]
`)
  expect(JSON.parse(readFile('package.json'))).toMatchObject({
    description: 'superb',
  })
})
