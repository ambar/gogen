const {mock} = require('gogen')

test('basic', async () => {
  const {files, readFile} = await mock(__dirname, 'mylib')
  expect(files).toMatchInlineSnapshot(`
Array [
  ".eslintrc",
  ".gitignore",
  "FAQ.md",
  "README.md",
  "index.js",
  "package.json",
  "subpackage/.gitignore",
  "subpackage/package.json",
]
`)

  // patches package.json
  expect(JSON.parse(readFile('package.json'))).toMatchObject({
    name: 'mylib',
    description: 'superb',
  })
  expect(JSON.parse(readFile('subpackage/package.json'))).toMatchObject({
    name: 'subpackage',
    license: 'MIT',
  })

  // re-run
  await expect(mock('.', 'mylib')).resolves.not.toThrow()
})
