import {VFile} from '../lib/vfile'

test('basic', () => {
  const file = new VFile()
  file.path = '/foo/bar/readme.md'

  expect(file.base).toBe('')
  file.base = '/foo'
  expect(file.base).toMatchInlineSnapshot(`"/foo"`)
  expect(file.relative).toMatchInlineSnapshot(`"bar/readme.md"`)

  file.path = '/foo/bar/readme.mdx'
  expect(file.path).toMatchInlineSnapshot(`"/foo/bar/readme.mdx"`)

  file.basename = 'changelog.md'
  expect(file.basename).toMatchInlineSnapshot(`"changelog.md"`)

  file.extname = '.mdx'
  expect(file.extname).toMatchInlineSnapshot(`".mdx"`)

  file.dirname = '/foo/baz'
  expect(file.dirname).toMatchInlineSnapshot(`"/foo/baz"`)

  // no setter
  file.relative = 'aha.js'
  expect(file.relative).toMatchInlineSnapshot(`"baz/changelog.mdx"`)

  expect(file.isBuffer()).toBe(false)
  file.contents = Buffer.from('')
  expect(file.isBuffer()).toBe(true)
  expect(file.contents).toBeInstanceOf(Buffer)
})
