import { Background } from '#/components/Background'
import { createFileRoute } from '@tanstack/react-router'
import { FlaskConicalIcon, HandshakeIcon } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Background />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-5xl font-bold">Toki's Take</h1>
          <p className="mt-3 text-slate-300">
            Events, experiments etc from my Obsidian notebook
          </p>
        </header>
      </main>
      <div className="p-8">
        <p className="m-2">
          Created this as a space to put my Obsidian notes and make them easily
          sharable with anyone else who was curious.
        </p>
      </div>
      <div className="p-8 mx-auto ms-2 justify-center">
        <h2 className="text-2xl mb-2">Events</h2>
        <HandshakeIcon />
        <ul>
          <li>
            <a
              href="/events/threejs-conf-2026"
              className="hover:text-slate-300/80"
            >
              <ul>
                <li>Three.js Conf 2026</li>
              </ul>
            </a>
          </li>
        </ul>
        <h2 className="text-2xl mb-2">Experiments</h2>

        <FlaskConicalIcon />
        <ul>
          <li>
            <a href="/experiments" className="hover:text-slate-300/80">
              Experiments
            </a>
          </li>
        </ul>
      </div>
      <div className="p-8 mx-auto ms-2 justify-center"></div>
    </>
  )
}
