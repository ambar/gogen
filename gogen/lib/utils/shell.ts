import {spawn, SpawnOptions} from 'child_process'
import {Stream, Readable} from 'stream'
export {SpawnOptions}

async function getStream(stream: Stream) {
  let data = ''
  for await (const chunk of stream as Readable) {
    data += chunk
  }
  return data
}
// async shell version of `execSync`
const shell = async (cmd: string, options: SpawnOptions = {}) => {
  const child = spawn(cmd, {
    shell: true,
    ...options,
    env: {...process.env, ...options.env},
  })

  const done = new Promise<{code: number; signal: NodeJS.Signals}>(
    (resolve, reject) => {
      child.on('close', (code: number, signal: NodeJS.Signals) => {
        code ? resolve({code, signal}) : reject({code, signal})
      })
    }
  )

  const textFromStream = (stream: Stream | null): Promise<string | null> =>
    stream
      ? getStream(stream).then((r: string) => r.trim())
      : Promise.resolve(null)

  const allDone = <T1, T2, T3, T4>(promises: [T1, T2, T3, T4]) =>
    promises.map((p: any) => p.catch((r: any) => r)) as [T1, T2, T3, T4]

  return Promise.all(
    allDone([
      done,
      textFromStream(child.stdin),
      textFromStream(child.stderr),
      textFromStream(child.stdout),
    ])
  ).then(([{code, signal}, stdin, stderr, stdout]) => {
    const r = {code, signal, stdin, stderr, stdout}
    return code ? Promise.reject(r) : r
  })
}

export default shell
