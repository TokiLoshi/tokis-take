import { Background } from '#/components/Background'
import { createFileRoute } from '@tanstack/react-router'
import { FlaskConical, HomeIcon } from 'lucide-react'

export const Route = createFileRoute('/experiments/')({
  component: ExperimentPage,
})

function ExperimentPage() {
  return (
    <>
      <Background />
      <div className="mx-auto max-w-6xl px-6 py-12 justify">
        <div className="justify-center items-center text-center">
          <h2 className="text-2xl">Experiments brewing... brb</h2>
          <FlaskConical className="mx-auto mt-3" />
          <p className="mt-2">Nothing to see just yet</p>
        </div>
        <div className="p-8 justify-around">
          <a href="/" className=" hover:text-slate-400">
            <HomeIcon />
          </a>
        </div>
      </div>
    </>
  )
}
