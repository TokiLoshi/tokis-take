import { createFileRoute, Link } from '@tanstack/react-router'
import { FlaskConical, HomeIcon } from 'lucide-react'

export const Route = createFileRoute('/experiments/')({
  component: ExperimentPage,
})

function ExperimentPage() {
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
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <FlaskConical className="mx-auto mb-4 size-10 text-amber-400 motion-safe:animate-bounce" />
          <h1 className="font-display text-3xl">Experiments brewing...</h1>
          <p className="mt-2 text-slate-400">
            Nothing to see just yet. Check back soon!
          </p>
        </div>
      </main>
    </>
  )
}
