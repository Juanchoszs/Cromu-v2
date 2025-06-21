import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from '@/context/auth-context';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CROMU | Soluciones Financieras",
  icons: {
    icon: "/logo-bola.png",
  },
  description: "Soluciones financieras innovadoras para un futuro próspero",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/logo-bola.png"/>
        <style>
          {`
            link[rel="icon"] {
              width: 128px;
              height: 128px;
            }
          `}
        </style>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LanguageProvider>
              {children}
              <Analytics />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}