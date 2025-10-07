"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function ReunionPage() {
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
    <div className="min-h-screen bg-background">
      <GameHeader enigmeNumber={2} enigmeTitle="Mission accomplie" />

      <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mystery-glow mb-4">
            Mission accomplie !
          </h1>
          <p className="text-muted-foreground text-lg">Les deux équipes ont réussi leurs missions</p>
        </div>

        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Découvertes</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">La maladie identifiée</p>
                <p className="text-muted-foreground">Cancer du sein</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">Le mois de sensibilisation</p>
                <p className="text-muted-foreground">Octobre Rose</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">Le symbole</p>
                <p className="text-muted-foreground">Ruban rose</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">Les codes déverrouillés</p>
                <p className="text-muted-foreground">1031 (1er octobre, 31 jours)</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Comprendre le cancer du sein</h2>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
            <div className="text-center w-full">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/fQwar_-QdiQ"
                title="Cancer du sein - Vidéo explicative"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Cette vidéo explique les bases du cancer du sein, son dépistage et l'importance de la sensibilisation.
          </p>
        </Card>

        <Card className="bg-card border-border p-8 mb-8 border-l-4 border-accent">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Message du professeur</h2>
          <p className="text-foreground leading-relaxed mb-4">
            "Excellent travail ! Vous avez compris que je cherchais un remède naturel pour contribuer à la lutte contre
            le cancer du sein. Mais où se trouve cette plante mystérieuse ?"
          </p>
          <p className="text-foreground leading-relaxed italic">
            "Sous les platanes anciens, au cœur de la ville rose, la nature cache ses remèdes à qui sait écouter..."
          </p>
        </Card>

        <div className="text-center">
          <Button
            onClick={() => router.push("/enigme-3")}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Continuer vers l'énigme 3
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
