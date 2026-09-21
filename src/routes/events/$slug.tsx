import { renderMarkdown } from '#/lib/markdown'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

async function listFiles(
  dir: string,
  root = dir,
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      for (const [k, v] of await listFiles(fullPath, root)) {
        map.set(k, v)
      }
    } else {
      map.set(entry.name, path.relative(root, fullPath))
    }
  }
  return map
}

const getEvent = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const md = await readFile(
      path.join(process.cwd(), 'content/events', slug, 'notes.md'),
      'utf8',
    )
    const attachments = path.join(
      process.cwd(),
      'public/events',
      slug,
      'attachments',
    )
    const files = await listFiles(attachments)
    return renderMarkdown(md, `/events/${slug}/attachments`, files)
  })
export const Route = createFileRoute('/events/$slug')({
  loader: ({ params }) => getEvent({ data: params.slug }),
  component: EventPage,
})

function EventPage() {
  const html = Route.useLoaderData()
  return <article dangerouslySetInnerHTML={{ __html: html }} />
}
