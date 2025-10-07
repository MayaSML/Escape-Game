"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Leaf, Lightbulb, Eye, Scan } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function Enigme4Page() {
  const router = useRouter()
  const { room, currentPlayer } = useGame()
  const [plantName, setPlantName] = useState("")
  const [showHiddenMessage, setShowHiddenMessage] = useState(false)
  const [showBotanicalDetails, setShowBotanicalDetails] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [error, setError] = useState("")
  const [chatOpen, setChatOpen] = useState(false)

  const correctAnswer = "TAXUS BACCATA"

  useEffect(() => {
    if (!room || !currentPlayer) {
      router.push("/")
      return
    }

    if (!room.isStarted) {
      router.push("/lobby")
    }
  }, [room, currentPlayer, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedAnswer = plantName.trim().toUpperCase()

    if (normalizedAnswer === correctAnswer) {
      router.push("/finale")
    } else {
      setError("Ce n'est pas le bon nom. Analysez bien le dessin et le message caché.")
      setTimeout(() => setError(""), 3000)
    }
  }

  if (!room || !currentPlayer) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader enigmeNumber={4} enigmeTitle="L'Herboriste" />

      <div className="max-w-5xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <Leaf className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mystery-glow mb-4">
            Énigme 4 : L'Herboriste
          </h1>
          <p className="text-muted-foreground text-lg">Découvrez le nom de la plante miraculeuse</p>
        </div>

        <Card className="bg-card border-border p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Leaf className="h-10 w-10 text-accent" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Bienvenue au Jardin des Plantes</h2>
              <p className="text-foreground leading-relaxed mb-3">
                "Ah, vous voilà enfin ! Le professeur m'avait prévenu de votre venue. Il m'a confié ces documents avant
                sa disparition. Il disait que seuls ceux qui comprendraient vraiment sa quête pourraient identifier la
                plante."
              </p>
              <p className="text-foreground leading-relaxed italic">
                "Voici un dessin botanique incomplet et une lettre. Mais attention, certaines informations ne sont
                visibles que sous une lumière spéciale..."
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">Dessin botanique</h2>
            <Button variant="outline" size="sm" onClick={() => setShowBotanicalDetails(!showBotanicalDetails)}>
              <Scan className="mr-2 h-4 w-4" />
              {showBotanicalDetails ? "Masquer" : "Analyser"}
            </Button>
          </div>

          <div className="bg-muted p-8 rounded-lg mb-4">
            <div className="max-w-md mx-auto">
              <div className="aspect-square bg-background rounded-lg border-2 border-border p-6 flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                  <Leaf className="h-24 w-24 text-accent mx-auto" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Famille : Taxaceae</p>
                    <p className="text-sm text-muted-foreground">Feuilles : Persistantes, linéaires</p>
                    <p className="text-sm text-muted-foreground">Fruits : Arilles rouges</p>
                    <p className="text-sm text-muted-foreground">Toxicité : Élevée (sauf arille)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showBotanicalDetails && (
            <div className="bg-accent/10 border border-accent p-6 rounded-lg">
              <p className="font-semibold text-foreground mb-3">Analyse détaillée :</p>
              <div className="space-y-2 text-sm text-foreground">
                <p>• Arbre à croissance lente, peut vivre plusieurs millénaires</p>
                <p>• Écorce rougeâtre qui s'exfolie en plaques</p>
                <p>• Contient des alcaloïdes toxiques, notamment la taxine</p>
                <p>• Utilisé en médecine moderne pour extraire le TAXOL (paclitaxel)</p>
                <p className="font-semibold text-accent mt-3">
                  • Le TAXOL est utilisé dans le traitement de certains cancers, dont le cancer du sein
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">Message caché</h2>
            <Button variant="outline" size="sm" onClick={() => setShowHiddenMessage(!showHiddenMessage)}>
              <Eye className="mr-2 h-4 w-4" />
              {showHiddenMessage ? "Éteindre" : "Lumière UV"}
            </Button>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            {!showHiddenMessage ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Utilisez la lumière UV pour révéler le message...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-purple-900/20 border-2 border-purple-500 p-6 rounded-lg">
                  <p className="text-purple-300 font-mono text-center text-lg mb-4">Message révélé sous UV :</p>
                  <p className="text-purple-100 leading-relaxed">
                    "La plante que vous cherchez est un conifère ancien, vénéré depuis l'Antiquité. Son nom latin
                    commence par la lettre T. Elle pousse lentement mais vit éternellement. Son écorce rouge cache un
                    poison mortel, mais la science moderne en a extrait un remède contre le cancer."
                  </p>
                  <p className="text-purple-200 font-semibold mt-4 text-center">Nom latin : T____ B______</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Indice : Cherchez dans la famille des Taxaceae
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="plantName" className="text-lg">
                Quel est le nom latin complet de la plante ?
              </Label>
              <Input
                id="plantName"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Genre Espèce (ex: Genus species)"
                className="mt-2 text-lg"
              />
              <p className="text-sm text-muted-foreground mt-2">Format : NOM LATIN (deux mots)</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Révéler la plante
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
                <strong>Indice 1 :</strong> Le message caché mentionne un conifère de la famille Taxaceae. Le genre
                commence par "Taxus".
              </p>
              <p className="text-foreground mb-2">
                <strong>Indice 2 :</strong> L'espèce fait référence aux baies (baccata en latin signifie "qui porte des
                baies").
              </p>
              <p className="text-foreground">
                <strong>Indice 3 :</strong> C'est l'if commun, un arbre que l'on trouve dans les jardins et cimetières
                européens.
              </p>
            </Card>
          )}
        </div>
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
