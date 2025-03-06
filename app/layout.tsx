import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sehha App',
  description: 'Your personal health and fitness companion',
  icons: {
    icon: [
      { url: '/health.png', sizes: 'any' },
      { url: '/health.svg', type: 'image/svg+xml' },
    ],
    apple: '/health.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sehha-app.com',
    title: 'Sehha App',
    description: 'Your personal health and fitness companion',
    siteName: 'Sehha App',
    images: [
      {
        url: 'https://i.ibb.co/XLh5nVG/sehha.png',
        width: 1200,
        height: 630,
        alt: 'Sehha App - Health and Fitness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sehha App',
    description: 'Your personal health and fitness companion',
    images: ['https://i.ibb.co/XLh5nVG/sehha.png'],
    creator: '@sehhaapp',
  },
    generator: 'Mohamed Khire'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={['light', 'dark', 'purple', 'green']}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'