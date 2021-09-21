import {builtinModules} from 'module'
import dts from 'rollup-plugin-dts'
import pkg from './package.json'

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    input: pkg.source,
    output: [{file: pkg.types, format: 'esm'}],
    plugins: [dts({respectExternal: true})],
    external: (id) => builtinModules.includes(id),
  },
]

export default config
