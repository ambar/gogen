import canUseYarn from './canUseYarn'
import shell, {SpawnOptions} from './shell'

type InstallOptions = Pick<SpawnOptions, 'cwd' | 'stdio'> & {
  /** install to `devDependencies` */
  dev?: boolean
  /** skip console logs */
  silent?: boolean
  client?: 'auto' | 'yarn' | 'npm'
}

/**
 * Run `npm install` or `yarn install`
 */
const install = async (
  deps: string[] = [],
  {
    dev = false,
    silent = false,
    cwd,
    stdio = 'inherit',
    client = 'auto',
  }: InstallOptions = {}
) => {
  if (client === 'auto') {
    client = (await canUseYarn()) ? 'yarn' : 'npm'
  }
  if (client === 'yarn') {
    const args = deps.length ? ['add', ...deps, dev && '--dev'] : []
    if (
      silent &&
      ((await shell('yarn -v')).stdout?.startsWith('1.') ||
        // https://github.com/yarnpkg/berry/pull/3406
        (await shell('yarn add -h')).stdout?.includes('--silent'))
    ) {
      args.push('--silent')
    }
    await shell(`yarn ${args.filter((n) => n).join(' ')}`, {cwd, stdio})
  } else if (client === 'npm') {
    const args = deps.length ? [...deps, dev && '--save-dev'] : []
    if (silent) args.push('--silent')
    await shell(`npm i ${args.filter((n) => n).join(' ')}`, {cwd, stdio})
  }
}

export default install
