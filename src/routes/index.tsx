import { createFileRoute } from '@tanstack/react-router'
import { BotIcon, FlaskConicalIcon, HandshakeIcon } from 'lucide-react'
import Card from '../components/Card'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-5xl font-display font-bold text-center">
            Toki's Take
          </h1>
          <p className="mt-3 text-slate-300 text-center font-semibold">
            Events, experiments etc..
          </p>
        </header>
        <div className="mb-12 rounded-2xl text-center border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <p className="text-slate-300">
            Created this as a space to put my Obsidian notes and make them
            easily shareable with anyone who was curious.
          </p>
        </div>
        <section className="mb-12">
          <h2 className="mb-2 font-display text-2xl text-center">Events</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card
              to="/events/threejs-conf-2026"
              Icon={HandshakeIcon}
              title="Three.js Conf 2026"
              description="Two days of shaders, TSL, WebGPU and playful 3D in Paris."
            />
            <Card
              to="/events/sf-tech-week-2026"
              Icon={BotIcon}
              title="SF Tech Week 2026"
              description="MCP, agents, AI, security, startups, hackathons and more..."
            />
          </div>
        </section>
        <section className="mb-12">
          <h2 className="mb-2 font-display text-2xl text-center">
            Experiments
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card
              to="/experiments"
              Icon={FlaskConicalIcon}
              title="Experimental Page"
              description="This whole site is an experiment"
            />
          </div>
        </section>
      </main>
    </>
  )
}
