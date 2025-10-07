import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GameProvider } from "@/contexts/game-context"

const cinzel = Inter({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "La Quête de la Plante Rose - Escape Game",
  description: "Un escape game numérique sur le thème d'Octobre Rose à Toulouse",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="antialiased">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  )
}
