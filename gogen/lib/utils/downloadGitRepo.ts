import shell from './shell'
import createTempDir from './createTempDir'

// Used to install from non-npm package, such as monorepo or private hosted repo
const downloadGitRepo = async (repoPath: string) => {
  // TODO: support hash, subfolder
  const [repo, tagOrBranch] = repoPath.split('#')
  const tempDir = createTempDir({prefix: 'gogen'})
  await shell(
    `git clone --single-branch ${
      tagOrBranch ? `--branch ${tagOrBranch}` : ''
    } ${repo} ${tempDir}`
  )
  // optional install dependencies of rc file?
  // await install([], {cwd: tempDir, silent: true})
  return tempDir
}

export default downloadGitRepo
