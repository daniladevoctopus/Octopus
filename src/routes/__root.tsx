import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'


import '../styles.css'

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
        title: 'Octopus — независимая цифровая лаборатория',
      },
      {
        name: 'description',
        content:
          'Octopus — дом для независимых цифровых проектов, сервисов и экспериментов.',
      },
      {
        name: 'theme-color',
        content: '#142b2b',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/octopus-mark.svg',
        type: 'image/svg+xml',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
