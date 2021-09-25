const {mock} = require('gogen')

test('gogen', async () => {
  const {files, readFile} = await mock(__dirname, 'mylib', {})
  expect(files).toMatchSnapshot()
  expect(JSON.parse(readFile('package.json'))).toMatchSnapshot()
})
