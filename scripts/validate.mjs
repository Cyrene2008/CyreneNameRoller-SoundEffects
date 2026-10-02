import { spawn } from 'node:child_process'
import { cliPath } from './plugin-cli.mjs'
import { stagePlugin } from './stage-plugin.mjs'

const { stage, cleanup } = await stagePlugin()

try {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, 'validate', stage], { stdio: 'inherit', shell: false })
    child.on('error', reject)
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`cnrp validate exited with ${code}`)))
  })
} finally {
  await cleanup()
}
