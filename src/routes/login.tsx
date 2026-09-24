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
      <div>
        <input
          type="password"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button onClick={submit}>Enter</button>
        {error && <p>Nope.</p>}
      </div>
    </>
  )
}
