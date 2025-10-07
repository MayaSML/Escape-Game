"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FlaskConical, Hospital, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function Enigme2Page() {
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
      <GameHeader enigmeNumber={2} enigmeTitle="Double Mission" />

      <div className="max-w-5xl mx-auto px-4 py-12 pt-32">
        {/* Header */}
        <div className="text-center mb-12">
          <Users className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mystery-glow mb-4">
            Énigme 2 : Double Mission
          </h1>
          <p className="text-muted-foreground text-lg">Divisez-vous en deux équipes pour résoudre cette énigme</p>
        </div>

        {/* Instructions */}
        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Instructions</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Pour progresser, vous devez vous diviser en deux équipes. Chaque équipe aura une mission différente mais
              complémentaire.
            </p>
            <p className="font-semibold">
              Attention : Les deux équipes doivent collaborer pour obtenir les codes nécessaires au déverrouillage
              final.
            </p>
            <p className="text-muted-foreground italic">
              Une fois les deux énigmes résolues, vous découvrirez ensemble la nature de la maladie que le professeur
              étudiait.
            </p>
          </div>
        </Card>

        {/* Team Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Lab Team */}
          <Card className="bg-card border-border p-8 hover:border-accent transition-colors">
            <div className="text-center mb-6">
              <FlaskConical className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Équipe Laboratoire</h3>
              <p className="text-muted-foreground">Mission scientifique</p>
            </div>
            <div className="space-y-3 mb-6 text-sm text-foreground">
              <p>• Reconstituer une séquence ADN</p>
              <p>• Décrypter des données de recherche</p>
              <p>• Obtenir le code du cadenas</p>
            </div>
            <Button
              onClick={() => router.push("/enigme-2/labo")}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Accéder à la mission Labo
            </Button>
          </Card>

          {/* Oncopole Team */}
          <Card className="bg-card border-border p-8 hover:border-accent transition-colors">
            <div className="text-center mb-6">
              <Hospital className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Équipe Oncopole</h3>
              <p className="text-muted-foreground">Mission médicale</p>
            </div>
            <div className="space-y-3 mb-6 text-sm text-foreground">
              <p>• Analyser des documents médicaux</p>
              <p>• Résoudre une énigme sur les cellules</p>
              <p>• Obtenir le code du cadenas</p>
            </div>
            <Button
              onClick={() => router.push("/enigme-2/oncopole")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Accéder à la mission Oncopole
            </Button>
          </Card>
        </div>

        {/* Reunion Link */}
        <Card className="bg-muted border-border p-6 mt-8 text-center">
          <p className="text-foreground mb-4">Les deux équipes ont terminé leurs missions ?</p>
          <Button onClick={() => router.push("/enigme-2/reunion")} variant="outline" size="lg">
            Réunir les équipes
          </Button>
        </Card>
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
