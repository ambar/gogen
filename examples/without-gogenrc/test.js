const {mock} = require('gogen')

test('basic', async () => {
  const {files} = await mock(__dirname, 'mylib')
  expect(files).toMatchInlineSnapshot(`
Array [
  ".eslintrc",
  ".gitignore",
  "index.js",
  "package.json",
]
`)
})
