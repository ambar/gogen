const {mock} = require('../lib')

describe('gogen', () => {
  it('should throw errors', async () => {
    await expect(mock('', '')).rejects.toThrow()
    await expect(mock('foo', '')).rejects.toThrow()
    await expect(mock('', 'foo')).rejects.toThrow()
  })
})
