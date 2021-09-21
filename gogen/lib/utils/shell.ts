import {spawn} from 'child_process'
import getStream from 'get-stream'

// async shell version of `execSync`
// TODO: use `execa`, removing `semver`: execa -> cross-spwan -> semver (59K)
// https://github.com/moxystudio/node-cross-spawn
const shell = async (cmd: string, options = {}) => {
  const child = spawn(cmd, {
    shell: true,
    ...options,
    env: {...process.env, ...(options as any).env},
  })

  const done = new Promise((resolve, reject) => {
    child.on('close', (code: any, signal: any) => {
      code ? resolve({code, signal}) : reject({code, signal})
    })
  })

  const textFromStream = (stream: any) =>
    stream
      ? getStream(stream).then((r: any) => r.trim())
      : Promise.resolve(null)

  const allDone = (promises: any) =>
    Promise.all(promises.map((p: any) => p.catch((r: any) => r)))

  return allDone([
    done,
    textFromStream(child.stdin),
    textFromStream(child.stderr),
    textFromStream(child.stdout),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'code' does not exist on type 'unknown'.
  ]).then(([{code, signal}, stdin, stderr, stdout]) => {
    const r = {code, signal, stdin, stderr, stdout}
    return code ? Promise.reject(r) : r
  })
}

export default shell
