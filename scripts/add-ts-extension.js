import { existsSync, readdirSync, lstatSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// function to recurse dirs finding files
function fromDir (startPath, filter, callback) {
  if (!existsSync(startPath)) {
    throw new Error(`no dir ${startPath}`)
  }

  const files = readdirSync(startPath)
  for (let i = 0; i < files.length; i++) {
    const filename = join(startPath, files[i])
    const stat = lstatSync(filename)
    if (stat.isDirectory()) {
      fromDir(filename, filter, callback) // recurse
    } else if (filter.test(filename)) callback(filename)
  }
}

// this add .ts to lines like:  import .* from "\.  <-- only imports from ./ or ../ are touched
function addDotTsToLocalImports (filename) {
  const buf = readFileSync(filename)
  const replaced = buf.toString().replace(/(import .* from\s+['"])(?!.*\.ts['"])(\..*?)(?=['"])/g, '$1$2.ts')
  if (replaced !== buf.toString()) {
    writeFileSync(filename, replaced)
    console.log(`fixed imports at ${filename}`)
  }
}

// ------------------------
// --- BUILD TASK START
// ------------------------

const folder = process.argv[2]
if (folder && existsSync(join(process.cwd(), folder))) {
  // add .ts to generated imports so tsconfig.json module:"ES2020" works with node
  // see: https://github.com/microsoft/TypeScript/issues/16577
  fromDir(join(process.cwd(), folder), /\.ts$/, addDotTsToLocalImports)
} else {
  throw new Error('no folder in argument')
}
