import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import typescript from 'rollup-plugin-typescript2'
import {terser} from 'rollup-plugin-terser'

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    input: 'lib/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
    ],
    plugins: [
      alias({
        entries: require('./alias'),
      }),
      terser(),
      commonjs(),
      nodeResolve(),
      typescript({
        tsconfigOverride: {
          include: ['lib/**/*'],
          exclude: ['**/*.spec.*', '**/__tests__'],
          compilerOptions: {
            target: 'ES6',
          },
        },
      }),
    ],
  },
]

export default config
