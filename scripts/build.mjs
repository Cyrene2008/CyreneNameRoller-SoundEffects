import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { readIdentity, cliPath, root } from './plugin-cli.mjs'
import { stagePlugin } from './stage-plugin.mjs'

// The declaration is split (manifest.yml + contributions.json), so the release version is read
// through the same reader the CLI uses instead of require('./manifest.json').
const { identity } = await readIdentity()
const output = path.join(root, 'dist', `sound-effects-${identity.version}.cnrp`)
await fs.mkdir(path.dirname(output), { recursive: true })

// Pack the staged copy, not the repository root: the published package must not carry
// development tooling (scripts/, CI workflows, lockfile, vendor SDK).
const { stage, cleanup } = await stagePlugin()

try {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, 'pack', stage, '--out', output], { stdio: 'inherit', shell: false })
    child.on('error', reject)
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`cnrp exited with ${code}`)))
  })
} finally {
  await cleanup()
}
