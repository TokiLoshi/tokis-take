import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const getEvent = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const file = path.join(process.cwd(), 'content/events', slug, 'notes.md')
    return readFile(file, 'utf8')
  })
export const Route = createFileRoute('/events/$slug')({
  loader: ({ params }) => getEvent({ data: params.slug }),
  component: EventPage,
})

function EventPage() {
  const markdown = Route.useLoaderData()
  return <pre>{markdown}</pre>
}
