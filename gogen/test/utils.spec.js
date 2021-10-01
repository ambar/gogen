import shell from '../lib/utils/shell'
import boolify from '../lib/utils/boolify'

test('shell', async () => {
  expect(await shell('yarn -v')).toMatchObject({
    code: 0,
    stderr: '',
    stdout: expect.stringMatching('.'),
  })
  await expect(shell('yarn xyz')).rejects.toMatchObject({
    code: 1,
    stdout: expect.stringMatching(`Couldn't find a script named "xyz"`),
  })
})

test('boolify', async () => {
  expect(await boolify(Promise.resolve())).toBe(true)
  expect(await boolify(Promise.reject())).toBe(false)
})
