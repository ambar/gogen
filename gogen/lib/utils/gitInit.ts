import boolify from './boolify'
import shell, {SpawnOptions} from './shell'

/**
 * Run `git init`
 */
const gitInit = async (
  message = 'initial commit',
  {cwd, stdio = 'ignore'}: SpawnOptions = {}
) => {
  const isInsideWorkTree = () =>
    boolify(
      shell('git rev-parse --is-inside-work-tree', {cwd, stdio: 'ignore'})
    )

  const checkIgnore = () =>
    boolify(shell('git check-ignore .', {cwd, stdio: 'ignore'}))

  if ((await isInsideWorkTree()) && !(await checkIgnore())) {
    return
  }

  try {
    await shell('git init', {cwd, stdio})
    await shell('git add .', {cwd, stdio})
    await shell(`git commit -am '${message}'`, {cwd, stdio})
  } catch (e) {
    // no git installed, or no git user/email config
  }
}

export default gitInit
