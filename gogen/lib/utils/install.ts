import canUseYarn from './canUseYarn'
import shell, {SpawnOptions} from './shell'

type InstallOptions = Pick<SpawnOptions, 'cwd' | 'stdio'> & {
  /** install to `devDependencies` */
  dev?: boolean
  /** skip console logs */
  silent?: boolean
}

/**
 * Run `npm install` or `yarn install`
 */
const install = async (
  deps: string[] = [],
  {dev = false, silent = false, cwd, stdio = 'inherit'}: InstallOptions = {}
) => {
  const useYarn = await canUseYarn()
  if (useYarn) {
    const args = deps.length ? ['add', ...deps, dev && '--dev'] : []
    if (silent) args.push('--silent')
    await shell(`yarn ${args.filter((n) => n).join(' ')}`, {cwd, stdio})
  } else {
    const args = deps.length ? [...deps, dev && '--save-dev'] : []
    if (silent) args.push('--silent')
    await shell(`npm i ${args.filter((n) => n).join(' ')}`, {cwd, stdio})
  }
}

export default install
