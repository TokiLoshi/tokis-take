import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

async function listFiles(dir, root = dir, map = {}) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await listFiles(fullPath, root, map)
    } else {
      map[entry.name] = path.relative(root, fullPath)
    }
  }
  return map
}

const slugs = await readdir('content/events')

for (const slug of slugs) {
  const attachments = path.join('public/events', slug, 'attachments')
  let files = {}
  try {
    files = await listFiles(attachments)
  } catch (err) {
    console.warn(`No attachments for ${slug}: `, err.message)
  }
  const out = path.join('content/events', slug, 'attachments.json')
  await writeFile(out, JSON.stringify(files, null, 2))
  console.log(`Wrote ${out}`)
}
