import mri from 'mri'
import {API, Context} from './create'

export type Argv = {clone?: true}

export type ParsedArgv = mri.Argv<Argv>

export type Generator = (api: API, context: Context) => Promise<void>

export type VFile = File

// TODO: two bug in @types/vinyl-fs or TS compiler
// - Error when using sourcemap for reporting an error: Can't resolve original location of error.
// - Exported variable 'loadGenerator' has or is using name 'File' from external module "../@types/vinyl-fs" but cannot be named.
// https://github.com/microsoft/TypeScript/issues/5711
// https://github.com/microsoft/TypeScript/issues/9944
// export * as VFile from 'vinyl'
export interface File {
  /**
   * Gets and sets the contents of the file. If set to a `Stream`, it is wrapped in
   * a `cloneable-readable` stream.
   */
  contents: Buffer | NodeJS.ReadableStream | null

  /**
   * Gets and sets current working directory. Will always be normalized and have trailing
   * separators removed.
   */
  cwd: string

  //
  /**
   * Gets and sets base directory. Used for relative pathing (typically where a glob starts).
   * When `null` or `undefined`, it simply proxies the `file.cwd` property. Will always be
   * normalized and have trailing separators removed.
   */
  base: string

  /**
   * Gets and sets the absolute pathname string or `undefined`. Setting to a different value
   * appends the new path to `file.history`. If set to the same value as the current path, it
   * is ignored. All new values are normalized and have trailing separators removed.
   */
  path: string

  /**
   * Array of `file.path` values the Vinyl object has had, from `file.history[0]` (original)
   * through `file.history[file.history.length - 1]` (current). `file.history` and its elements
   * should normally be treated as read-only and only altered indirectly by setting `file.path`.
   */
  readonly history: ReadonlyArray<string>

  /**
   * Gets the result of `path.relative(file.base, file.path)`.
   */
  relative: string

  /**
   * Gets and sets the dirname of `file.path`. Will always be normalized and have trailing
   * separators removed.
   */
  dirname: string

  /**
   * Gets and sets the basename of `file.path`.
   */
  basename: string

  /**
   * Gets and sets stem (filename without suffix) of `file.path`.
   */
  stem: string

  /**
   * Gets and sets extname of `file.path`.
   */
  extname: string

  /**
   * Gets and sets the path where the file points to if it's a symbolic link. Will always
   * be normalized and have trailing separators removed.
   *
   * Throws when set to any value other than a string.
   */
  symlink: string | null
}
