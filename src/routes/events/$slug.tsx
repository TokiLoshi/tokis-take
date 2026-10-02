import { hasSession } from '#/lib/auth'
import { renderMarkdown } from '#/lib/markdown'
import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ArrowBigDownDash, ArrowBigUpDash, HomeIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

const getEvent = createServerFn({ method: 'GET' })
  .validator((slug: string) => {
    if (!/^[a-z0-9-]+$/.test(slug)) throw notFound()
    return slug
  })
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

    const manifest = await readFile(
      path.join(process.cwd(), 'content/events', slug, 'attachments.json'),
      'utf8',
    )
    const files = new Map<string, string>(Object.entries(JSON.parse(manifest)))

    return renderMarkdown(md, `/events/${slug}/attachments`, files)
  })
export const Route = createFileRoute('/events/$slug')({
  loader: ({ params }) => getEvent({ data: params.slug }),
  component: EventPage,
})

function EventPage() {
  const { html, toc } = Route.useLoaderData()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  )

  const handleArticleClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLImageElement) {
      setLightbox({ src: e.target.src, alt: e.target.alt })
      dialogRef.current?.showModal()
    }
  }

  const floatingButton =
    'fixed bottom-6 rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition hover:border-amber-400/40 hover:text-amber-300'
  return (
    <>
      <header className="mx-auto max-w-6xl px-6 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-300"
        >
          <HomeIcon className="size-8" />
          Toki's Take
        </Link>
      </header>
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
        <nav className="mb-10 lg:mb-0 lg:sticky lg:top-12 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm text-center">
          {toc.map((day) => (
            <div key={day.id} className="mb-6 ">
              <a
                href={`#${day.id}`}
                className="block text-xs font-semibold uppercase tracking-widest text-amber-400/80"
              >
                {day.title}
              </a>
              <ul className="mt-2 mb-2 p-2 space-y-1">
                {day.talks.map((t) => (
                  <li key={t.id} className="mb-1 mt-1">
                    <a
                      href={`#${t.id}`}
                      className="block px-3 py-1 text-sm text-slate-400 transition hover:bg-white/5 hover:text-amber-300"
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
          className="prose prose-invert prose-img:cursor-zoom-in prose-p:text-sm max-w-none prose-headings:font-display prose-a:text-amber-300/80 prose-a:hover:text-amber-400 prose-img:max-h-112 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: html }}
          onClick={handleArticleClick}
        />
        <dialog
          ref={dialogRef}
          onClick={() => dialogRef.current?.close()}
          className="m-auto overflow-visible bg-transparent p-0 outline-none backdrop:bg-black/80 backdrop:backdrop-blur-sm motion-safe:open:animate-lightbox"
        >
          {lightbox && (
            <div className="rounded-2xl border border-amber-400/30 bg-white/5 p-3 shadow-[0_0_60px_-15px_rgba(251,191,36,0.5)] backdrop-blur-md">
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-h-[85vh] max-w-[85vw] rounded-xl"
              />
            </div>
          )}
        </dialog>
      </div>
      <a
        href="#top"
        className={`${floatingButton} right-6`}
        aria-label="Back to top"
      >
        <ArrowBigUpDash />
      </a>
      <a
        href="#bottom"
        aria-label="Back to bottom"
        className={`${floatingButton} right-20`}
      >
        <ArrowBigDownDash />
      </a>
      <div id="bottom"></div>
    </>
  )
}
