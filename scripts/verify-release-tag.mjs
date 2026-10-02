import { readIdentity } from './plugin-cli.mjs'

const { identity } = await readIdentity()
const expected = `v${identity.version}`
const actual = String(process.env.GITHUB_REF_NAME || process.argv[2] || '')

if (actual !== expected) {
  throw new Error(`Release tag ${actual || '(missing)'} does not match manifest.yml version ${expected}`)
}

console.log(`Verified release tag ${actual}`)
