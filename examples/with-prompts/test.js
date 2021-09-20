const {mock} = require('gogen')

test('basic', async () => {
  const {files, readFile} = await mock(__dirname, 'mylib', {
    answers: {
      description: 'superb',
      devDeps: [],
    },
  })
  expect(files).toMatchInlineSnapshot(`
Array [
  ".eslintrc",
  ".gitignore",
  "index.js",
  "package.json",
]
`)
  expect(readFile('package.json')).toMatch(/superb/)
})
