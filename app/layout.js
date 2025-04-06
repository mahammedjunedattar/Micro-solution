// app/layout.js
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: '700'
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}