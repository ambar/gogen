import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias'
import {terser} from 'rollup-plugin-terser'
import pkg from './package.json'

const resolveRoot = path.resolve.bind(null, __dirname)

export default {
  input: 'lib/index.js',
  output: [
    //
    {file: pkg.main, format: 'cjs'},
  ],
  plugins: [
    // https://github.com/rollup/rollup-plugin-alias
    alias({
      'object.assign': resolveRoot('alias/object.assign/index'),
      'readable-stream/duplex': resolveRoot('alias/readable-stream/duplex'),
      'readable-stream/readable': resolveRoot('alias/readable-stream/readable'),
      'readable-stream/passthrough': resolveRoot(
        'alias/readable-stream/passthrough'
      ),
      'readable-stream': resolveRoot('alias/readable-stream/index'),
    }),
    // https://github.com/rollup/rollup-plugin-node-resolve
    resolve({
      jsnext: true,
      preferBuiltins: true,
    }),
    // https://github.com/rollup/rollup-plugin-commonjs
    commonjs({
      // enable dynamic requires
      ignore: ['conditional-runtime-dependency'],
    }),
    // https://github.com/terser-js/terser
    terser({
      ecma: 6,
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
  ],
}
