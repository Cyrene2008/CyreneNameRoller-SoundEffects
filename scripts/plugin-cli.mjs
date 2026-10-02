import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const root = path.resolve(import.meta.dirname, '..')
export const cliPath = path.join(root, 'node_modules', '@starcyrene', 'cyrene-name-roller', 'bin', 'cnrp.mjs')

/** Load the vendored cnrp module so scripts read the split declaration exactly like the CLI does. */
export async function readIdentity(directory = root) {
  const { readManifestSource } = await import(pathToFileURL(cliPath).href)
  const { raw, fromYml } = await readManifestSource(directory)
  return { identity: raw, fromYml }
}
