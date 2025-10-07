"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameChat } from "@/components/game-chat"

export default function BriefingPage() {
  const router = useRouter()
  const { room, currentPlayer } = useGame()
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (!room || !currentPlayer) {
      router.push("/")
      return
    }

    if (!room.isStarted) {
      router.push("/lobby")
    }
  }, [room, currentPlayer, router])

  if (!room || !currentPlayer) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-primary mystery-glow mb-4">La Lettre du Professeur</h1>
          <p className="text-muted-foreground">Lisez attentivement ce message...</p>
        </div>

        {/* Letter Card */}
        <Card className="bg-card border-border p-8 md:p-12 mb-8">
          <div className="space-y-6 text-foreground">
            <p className="text-sm text-muted-foreground italic text-right">Toulouse, Septembre 2024</p>

            <p className="leading-relaxed">Chers étudiants,</p>

            <p className="leading-relaxed">
              Si vous lisez ces lignes, c'est que mon absence a été remarquée. Ne vous inquiétez pas pour moi, je suis
              en sécurité. Mais j'ai besoin de votre aide.
            </p>

            <p className="leading-relaxed">
              Pendant des années, j'ai étudié une plante extraordinaire, capable de contribuer à la guérison d'une
              terrible maladie qui touche des milliers de personnes chaque année. Cette découverte ne doit pas rester
              cachée.
            </p>

            <p className="leading-relaxed">
              J'ai consigné toutes mes recherches dans mon dernier ouvrage, mais son titre est codé pour le protéger.
              Voici votre première énigme :
            </p>

            <div className="bg-muted p-6 rounded-lg my-6 border-l-4 border-accent">
              <p className="font-mono text-accent text-lg text-center tracking-wider">MFT QMBOUFT EF MB WJMMF SPTF</p>
            </div>

            <p className="leading-relaxed">Une fois le titre décodé, cherchez ce livre. Il contient la clé de tout.</p>

            <p className="leading-relaxed">
              Rappelez-vous : la science et la nature sont nos meilleures alliées. Toulouse recèle de secrets pour qui
              sait les voir.
            </p>

            <p className="leading-relaxed mt-8">Bonne chance,</p>

            <p className="font-serif text-xl text-primary">Professeur Jean Dufour</p>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => router.push("/enigme-1")}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Résoudre l'énigme
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
