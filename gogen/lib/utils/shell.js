const {spawn} = require('child_process')
const getStream = require('get-stream')

// async shell version of `execSync`
// TODO: use `execa`, removing `semver`: execa -> cross-spwan -> semver (59K)
// https://github.com/moxystudio/node-cross-spawn
const shell = async (cmd, options = {}) => {
  const child = spawn(cmd, {
    shell: true,
    ...options,
    env: {...process.env, ...options.env},
  })

  const done = new Promise((resolve, reject) => {
    child.on('close', (code, signal) => {
      code ? resolve({code, signal}) : reject({code, signal})
    })
  })

  const textFromStream = stream =>
    stream ? getStream(stream).then(r => r.trim()) : Promise.resolve(null)

  const allDone = promises => Promise.all(promises.map(p => p.catch(r => r)))

  return allDone([
    done,
    textFromStream(child.stdin),
    textFromStream(child.stderr),
    textFromStream(child.stdout),
  ]).then(([{code, signal}, stdin, stderr, stdout]) => {
    const r = {code, signal, stdin, stderr, stdout}
    return code ? Promise.reject(r) : r
  })
}

module.exports = shell
