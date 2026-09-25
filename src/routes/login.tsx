import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
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
  const navigate = useNavigate()
  async function submit() {
    const res = await login({ data: word })
    if (res.ok)
      navigate({
        to: '/events/$slug',
        params: {
          slug: 'threejs-conf-2026',
        },
      })
    else setError(true)
  }
  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="spacee-y-1">
            <h1 className="text-2x font-semibold">Toki's take</h1>
            <p className="text-neutral-400">What's the magic word?</p>
          </div>
          <div className="space-y-3">
            <input
              autoFocus
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-center tracking-widest outline-none focus:border-rose-500"
              type="password"
              placeholder="magic word goes here"
              value={word}
              onChange={(e) => {
                setWord(e.target.value)
                setError(false)
              }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <button
              onClick={submit}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-3 text-center tracking-widest outline-none focus:border-rose-500"
            >
              Enter
            </button>
          </div>
          <p
            className={`text-sm text-rose-400 transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}
          >
            Access denied
          </p>
        </div>
      </main>
    </>
  )
}
