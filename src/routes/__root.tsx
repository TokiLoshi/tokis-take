import {
  ClientOnly,
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { lazy, Suspense } from 'react'

const Background = lazy(() =>
  import('#/components/Background').then((m) => ({ default: m.Background })),
)

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
        </Suspense>
      </ClientOnly>

      <body className="bg-neutral-950 text-neutral-100">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
