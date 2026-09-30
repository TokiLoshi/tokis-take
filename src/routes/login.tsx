import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { checkPassword, grantSession } from '#/lib/auth'

const login = createServerFn({ method: 'POST' })
  .validator((password: string) => password)
  .handler(async ({ data }) => {
    if (!checkPassword(data)) {
      return { ok: false }
    }
    grantSession()
    return { ok: true }
  })

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [word, setWord] = useState('')
  const [error, setError] = useState(false)
  const [granted, setGranted] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    setError(false)
    const res = await login({ data: word })

    if (res.ok) {
      setGranted(true)
      await new Promise((resolve) => setTimeout(resolve, 1200))

      navigate({
        to: '/events/$slug',
        params: {
          slug: 'threejs-conf-2026',
        },
      })
    } else setError(true)
  }
  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-6">
        <div
          className={`w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition duration-500 ${error ? 'motion-safe:animate-shake' : ''} ${granted ? 'border-amber-400/60 shadow-[0_0_60px_-10px_rgba(251,191,36,0.6)] motion-safe:ascend' : ''}`}
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-semibold">Toki's take</h1>
            <p className="font-display">This page contains secrets...</p>
            <p className="text-neutral-400">
              Only those with the magic phrase may enter
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-center tracking-widest outline-none transition focus:border-amber-400/60 focus:shadow-[0_0_20px_-5px_rgba(251,191,36,0.5)]"
              type="password"
              placeholder="Magic phrase"
              aria-label="Magic phrase"
              value={word}
              onChange={(e) => {
                setWord(e.target.value)
                setError(false)
              }}
            />
            <button
              type="submit"
              disabled={granted}
              className="w-full cursor-pointer rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 tracking-widest text-amber-200 transition hover:bg-amber-400/20 hover:shadow-[0_0_20px_-5px_rgba(251,191,36,0.5)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              Enter
            </button>
          </form>
          <p
            className={`min-h-5 text-sm ${granted ? 'font-display text-amber-300' : 'text-rose-400'}`}
            aria-live="polite"
          >
            {error ? 'Access denied' : granted ? 'Access granted ✨' : ''}
          </p>
        </div>
      </main>
    </>
  )
}
