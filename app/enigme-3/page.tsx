"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, MapPin, Lightbulb, Map } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function Enigme3Page() {
  const router = useRouter()
  const { room, currentPlayer } = useGame()
  const [selectedPieces, setSelectedPieces] = useState<number[]>([])
  const [location, setLocation] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [error, setError] = useState("")
  const [chatOpen, setChatOpen] = useState(false)

  const correctLocation = "JARDIN DES PLANTES"
  const totalPieces = 6

  useEffect(() => {
    if (!room || !currentPlayer) {
      router.push("/")
      return
    }

    if (!room.isStarted) {
      router.push("/lobby")
    }
  }, [room, currentPlayer, router])

  const mapPieces = [
    { id: 1, clue: "Allées Jean Jaurès", position: "top-left" },
    { id: 2, clue: "Grand Rond", position: "top-center" },
    { id: 3, clue: "Muséum", position: "top-right" },
    { id: 4, clue: "Platanes centenaires", position: "bottom-left" },
    { id: 5, clue: "Jardin botanique", position: "bottom-center" },
    { id: 6, clue: "Carrefour Busca", position: "bottom-right" },
  ]

  const togglePiece = (id: number) => {
    if (selectedPieces.includes(id)) {
      setSelectedPieces(selectedPieces.filter((p) => p !== id))
    } else {
      setSelectedPieces([...selectedPieces, id])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedLocation = location.trim().toUpperCase()

    if (normalizedLocation === correctLocation && selectedPieces.length === totalPieces) {
      router.push("/enigme-4")
    } else if (selectedPieces.length !== totalPieces) {
      setError("Vous devez d'abord reconstituer toute la carte !")
      setTimeout(() => setError(""), 3000)
    } else {
      setError("Ce n'est pas le bon lieu. Analysez les indices de la carte.")
      setTimeout(() => setError(""), 3000)
    }
  }

  if (!room || !currentPlayer) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader enigmeNumber={3} enigmeTitle="La Ville Rose" />

      <div className="max-w-5xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <Map className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mystery-glow mb-4">
            Énigme 3 : La Ville Rose
          </h1>
          <p className="text-muted-foreground text-lg">Trouvez le jardin où se cache la plante</p>
        </div>

        <Card className="bg-card border-border p-8 mb-8 border-l-4 border-accent">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Indice du professeur</h2>
          <p className="text-foreground leading-relaxed italic text-lg">
            "Sous les platanes anciens, au cœur de la ville rose, la nature cache ses remèdes à qui sait écouter... Le
            lieu que vous cherchez abrite des milliers d'espèces végétales et porte le nom de ce qu'il contient."
          </p>
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Reconstituer la carte</h2>
          <p className="text-muted-foreground mb-6">
            Cliquez sur chaque fragment pour le révéler. Les indices vous aideront à identifier le lieu.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {mapPieces.map((piece) => (
              <button
                key={piece.id}
                onClick={() => togglePiece(piece.id)}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  selectedPieces.includes(piece.id)
                    ? "bg-accent/20 border-accent"
                    : "bg-muted border-border hover:border-accent/50"
                }`}
              >
                {selectedPieces.includes(piece.id) ? (
                  <div className="p-4 h-full flex flex-col items-center justify-center">
                    <MapPin className="h-8 w-8 text-accent mb-2" />
                    <p className="text-sm font-semibold text-foreground text-center">{piece.clue}</p>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Fragment {piece.id}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Fragments révélés : {selectedPieces.length} / {totalPieces}
            </p>
          </div>
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Coordonnées GPS codées</h2>
          <div className="bg-muted p-6 rounded-lg mb-4">
            <p className="font-mono text-accent text-center text-lg mb-2">43.5° N, 1.4° E</p>
            <p className="text-muted-foreground text-sm text-center">
              Ces coordonnées pointent vers un lieu emblématique de Toulouse
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-background p-4 rounded border border-border">
              <p className="font-semibold text-foreground mb-1">Jardin Royal</p>
              <p className="text-muted-foreground">Près du Capitole</p>
            </div>
            <div className="bg-background p-4 rounded border border-border">
              <p className="font-semibold text-foreground mb-1">Jardin des Plantes</p>
              <p className="text-muted-foreground">Grand Rond, Busca</p>
            </div>
            <div className="bg-background p-4 rounded border border-border">
              <p className="font-semibold text-foreground mb-1">Jardin Japonais</p>
              <p className="text-muted-foreground">Compans-Caffarelli</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="location" className="text-lg">
                Quel est le nom du jardin ?
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Entrez le nom du jardin..."
                className="mt-2 text-lg"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Valider le lieu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={() => setShowHint(!showHint)} className="text-muted-foreground">
            <Lightbulb className="mr-2 h-4 w-4" />
            {showHint ? "Masquer l'indice" : "Besoin d'un indice ?"}
          </Button>
          {showHint && (
            <Card className="bg-muted border-border p-6 mt-4">
              <p className="text-foreground mb-2">
                <strong>Indice 1 :</strong> Le professeur mentionne "des milliers d'espèces végétales". Quel jardin de
                Toulouse est spécialisé dans les plantes ?
              </p>
              <p className="text-foreground">
                <strong>Indice 2 :</strong> Les fragments de carte mentionnent "Jardin botanique", "Grand Rond" et
                "Busca". Ces lieux sont tous proches d'un même jardin historique.
              </p>
            </Card>
          )}
        </div>
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
