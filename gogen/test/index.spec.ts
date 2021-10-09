import * as api from '../lib'

test('should throw errors', async () => {
  expect(api).toMatchObject({
    create: expect.any(Function),
    minimist: expect.any(Function),
    mock: expect.any(Function),
    run: expect.any(Function),
  })
})
