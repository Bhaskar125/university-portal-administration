import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'University Academic Evaluation Portal',
  description: 'Comprehensive university portal for academic evaluation and performance tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 