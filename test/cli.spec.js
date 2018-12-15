const {mock} = require('../lib')
const shell = require('../lib/utils/shell')

describe('gogen', () => {
  beforeAll(async () => {
    // install workspace deps
    await shell('yarn --silent', {cwd: 'examples'})
  })

  it('should throw errors', async () => {
    await expect(mock('', '')).rejects.toThrow()
    await expect(mock('foo', '')).rejects.toThrow()
    await expect(mock('', 'foo')).rejects.toThrow()
  })

  it('should generate `basic`', async () => {
    const {files, readFile} = await mock('./examples/basic', 'mylib')
    expect(files).toMatchSnapshot()

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
    await expect(mock('./examples/basic', 'mylib')).resolves.not.toThrow()
  })

  it('should generate `with-ejs`', async () => {
    const {files, readFile} = await mock('./examples/with-ejs', 'mylib')
    expect(files).toMatchSnapshot()
    expect(JSON.parse(readFile('package.json'))).toMatchObject({
      description: 'superb',
    })
  })

  it('should generate `without-gogenrc`', async () => {
    const {files} = await mock('./examples/without-gogenrc', 'mylib')
    expect(files).toMatchSnapshot()
  })

  it('should generate `create-gogen`', async () => {
    const {files} = await mock('./examples/create-gogen', 'mylib')
    expect(files).toMatchSnapshot()
  })
})
