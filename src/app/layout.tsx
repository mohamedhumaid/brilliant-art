import type { Metadata, Viewport } from 'next'
import { Epilogue } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import './globals.css'

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-epilogue',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
}

export const metadata: Metadata = {
  title: 'Brilliant Art | Turning Vision Into Creative Power',
  description:
    'Brilliant Art is a multidisciplinary creative agency specializing in brand identity, motion design, web experiences, and 3D immersive visuals.',
  openGraph: {
    title: 'Brilliant Art | Turning Vision Into Creative Power',
    description: 'A multidisciplinary creative agency where art meets high-end technology.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${epilogue.variable} dark`}>
      <body className="bg-void text-on-surface font-epilogue antialiased overflow-x-hidden">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
