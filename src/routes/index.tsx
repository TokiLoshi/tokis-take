import { createFileRoute } from '@tanstack/react-router'
import { HandshakeIcon } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <div className="p-8">
        <h1 className="text-4xl font-bold">Toki's Take</h1>
        <p className="text-2xl m-2">Events, experiments etc.</p>
        <p className="m-2">
          Created this as a space to put my Obsidian notes and make them easily
          sharable with anyone else who was curious.
        </p>
      </div>
      <div className="p-8 mx-auto ms-2 justify-center">
        <h2 className="text-2xl">Events</h2>
        <HandshakeIcon />
        <ul>
          <li>
            <a
              href="/events/threejs-conf-2026"
              className="hover:text-slate-300/80"
            >
              Three.js Conf 2026
            </a>
          </li>
        </ul>
        <h2 className="text-2xl">Experiments</h2>
        <HandshakeIcon />
        <ul>
          <li>
            <a href="/experiments/brewing" className="hover:text-slate-300/80">
              Experiments
            </a>
          </li>
        </ul>
      </div>
      <div className="p-8 mx-auto ms-2 justify-center"></div>
    </>
  )
}
