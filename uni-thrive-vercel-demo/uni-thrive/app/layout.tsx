import type { Metadata } from 'next'
import '../styles/globals.css'

const themeScript = `(function(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}var d=t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',d);})();`

export const metadata: Metadata = {
  title: 'UNI-THRIVE — Student Wellness Platform',
  description: 'Your academic and personal development companion. Track mental, psychological, and physical wellness.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
