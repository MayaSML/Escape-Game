"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function LivrePage() {
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
  // </CHANGE>

  return (
    <div className="min-h-screen bg-background">
      <GameHeader enigmeNumber={1} enigmeTitle="Le Livre et le Code" />

      <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
        {/* </CHANGE> */}
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mystery-glow mb-4">
            Les Plantes de la Ville Rose
          </h1>
          <p className="text-muted-foreground text-lg">Par le Professeur Jean Dufour</p>
        </div>

        <Card className="bg-card border-border p-8 mb-8">
          <div className="aspect-[3/4] max-w-md mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-8 border-2 border-border">
            <div className="text-center p-8">
              <BookOpen className="h-24 w-24 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Les Plantes</h2>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">de la Ville Rose</h3>
              <p className="text-muted-foreground">Prof. Jean Dufour</p>
            </div>
          </div>

          <p className="text-center text-muted-foreground italic">
            Vous feuilletez le livre jusqu'à la dernière page...
          </p>
        </Card>

        <Card className="bg-card border-border p-8 mb-8 border-l-4 border-accent">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Note manuscrite</h2>
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed italic font-serif text-lg">
              "Si vous lisez ces mots, c'est que vous avez réussi la première étape. Bravo."
            </p>
            <p className="text-foreground leading-relaxed font-serif text-lg">
              Avant de connaître le remède, il faut comprendre la maladie...
            </p>
            <p className="text-foreground leading-relaxed font-serif text-lg">
              La réponse se trouve dans deux lieux emblématiques de Toulouse : le laboratoire de recherches et
              l'Oncopole. Divisez-vous en deux équipes. Chacune devra résoudre son énigme, mais c'est ensemble que vous
              découvrirez la vérité.
            </p>
            <p className="text-foreground leading-relaxed font-serif text-lg">
              Rappelez-vous : la collaboration est la clé de toute grande découverte scientifique.
            </p>
            <p className="text-foreground leading-relaxed italic font-serif text-lg mt-6">
              "Le mois d'octobre cache un secret rose..."
            </p>
          </div>
        </Card>

        <div className="text-center">
          <Button
            onClick={() => router.push("/enigme-2")}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Continuer vers l'énigme 2
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
