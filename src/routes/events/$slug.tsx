import { hasSession } from '#/lib/auth'
import { renderMarkdown } from '#/lib/markdown'
import { createFileRoute, redirect } from '@tanstack/react-router'
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
    if (!hasSession()) {
      throw redirect({
        to: '/login',
      })
    }
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
  const { html, toc } = Route.useLoaderData()
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:grid lg:grid-cols[240px_1fr] lg:gap-12">
      <nav className="mb-10 lg:mb-0 lg:sticky lg:top-12 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        {toc.map((day) => (
          <div key={day.id} className="mb-6">
            <a
              href={`#${day.id}`}
              className="block text-sm font-semibold uppercase tracking-wide text-slate-200 hover:text-white"
            >
              {day.title}
            </a>
            <ul className="mt-2 mb-2 space-y-1 border border-slate-300 rounded">
              {day.talks.map((t) => (
                <li key={t.id} className="mb-1 mt-1">
                  <a
                    href={`#${t.id}`}
                    className="block pl-3 text-sm text-slate-300 hover:text-white"
                  >
                    {t.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <article
        className="prose prose-invert prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <a
        href="#top"
        className="fixed bottom-6 right-6 rounded-full bg-slate-900/80 px-3 py-2 text-sm backdrop-blur hover:bg-slate-700"
      >
        ↑ Back to the top
      </a>
    </div>
  )
}
