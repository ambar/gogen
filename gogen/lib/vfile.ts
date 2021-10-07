/// <reference types="node" />
import path from 'path'
import assert from 'assert'

type Content = Buffer | NodeJS.ReadableStream | null

const assertString = (v: string) => {
  assert.ok(typeof v === 'string')
}

const assertNoneEmptyString = (v: string) => {
  assertString(v)
  assert.ok(v)
}

/**
 * Virtual File
 *
 * Like simplified vinyl, no dependencies.
 *
 * TODO: extends Blob (Node v15): https://nodejs.org/api/buffer.html#buffer_class_blob
 */
export class VFile {
  #base: string = ''
  #contents: Content = null
  #history: string[] = []

  get contents() {
    return this.#contents
  }
  set contents(v: Content) {
    this.#contents = v
  }

  get path() {
    return this.#history[this.#history.length - 1]
  }
  set path(v: string) {
    assertString(v)
    this.#history.push(v)
  }

  get dirname() {
    return path.dirname(this.path)
  }
  set dirname(v: string) {
    assert.ok(this.path)
    this.path = path.join(v, this.basename)
  }

  get basename() {
    assert.ok(this.path)
    return path.basename(this.path)
  }
  set basename(v: string) {
    assert.ok(this.path)
    this.path = path.join(this.dirname, v)
  }

  get extname() {
    assert.ok(this.path)
    return path.extname(this.path)
  }
  set extname(v: string) {
    const {name} = path.parse(this.basename)
    this.basename = path.format({name, ext: v})
  }

  get base() {
    return this.#base
  }
  set base(v: string) {
    assertNoneEmptyString(v)
    this.#base = v
  }

  get relative() {
    assert.ok(this.path)
    return path.relative(this.base, this.path)
  }

  isBuffer() {
    return Buffer.isBuffer(this.#contents)
  }
}
