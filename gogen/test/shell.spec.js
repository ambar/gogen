const shell = require('../lib/utils/shell')

test('shell', async () => {
  expect(await shell('yarn -v')).toMatchObject({
    code: 0,
    stderr: '',
    stdout: expect.stringMatching('.'),
  })
  await expect(shell('yarn xyz')).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringMatching(/Command "xyz" not found/),
  })
})
