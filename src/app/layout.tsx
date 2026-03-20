import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bechtle ES — Margin Initiative',
  description: 'Spain customer profile analysis and margin improvement simulation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
