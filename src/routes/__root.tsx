import {
  ClientOnly,
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { lazy, Suspense, useEffect } from 'react'
import posthog from 'posthog-js'

const Background = lazy(() =>
  import('#/components/Background').then((m) => ({ default: m.Background })),
)

const Analytics = () => {
  if (window.location.host.includes('localhost')) return
  useEffect(() => {
    const key = import.meta.env.VITE_POSTHOG_KEY
    if (!key) throw new Error('Posthog key not configured')
    posthog.init(key, {
      api_host: 'https://us.i.posthog.com',
      persistence: 'memory',
      capture_pageview: 'history_change',
      autocapture: false,
      disable_session_recording: true,
      defaults: '2026-05-30',
    })
  }, [])
  return null
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: "Toki's Take",
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon1.png',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <ClientOnly>
        <Suspense fallback={null}>
          <Background />
          <Analytics />
        </Suspense>
      </ClientOnly>

      <body className="bg-neutral-950 text-neutral-100">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
