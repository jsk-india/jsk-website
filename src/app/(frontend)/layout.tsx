import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | JSK Industries',
    default: 'JSK Industries — Powering Growth',
  },
  description:
    'JSK Industries Pvt. Ltd. is a leading aluminium conductor manufacturer specializing in power transmission & distribution conductors, wire rods, and innovative new verticals.',
}

/** Root layout for the public-facing frontend. */
export default function FrontendRootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Plus Jakarta Sans + Inter from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        {children}
      </body>
    </html>
  )
}
