const {mock} = require('gogen')

test('basic', async () => {
  const {files} = await mock(__dirname, 'mylib')
  expect(files).toMatchInlineSnapshot(`
Array [
  ".gitignore",
  ".gogenrc.js",
  "package.json",
  "template/gitignore",
  "template/index.js",
  "template/package.json",
]
`)
})
