import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/lib/LanguageContext'

export const metadata: Metadata = {
  title: 'رحلة سلسة - بدون فراغات',
  description: 'موقع تبديل - رحلة سلسة بدون فراغات',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic" suppressHydrationWarning={true}>
        <LanguageProvider>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  )
}