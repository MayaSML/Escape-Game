"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, BookOpen, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function Enigme1Page() {
  const router = useRouter()
  const { room, currentPlayer } = useGame()
  const [answer, setAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [error, setError] = useState("")
  const [showDecoder, setShowDecoder] = useState(false)
  const [decoderInput, setDecoderInput] = useState("")
  const [decoderOutput, setDecoderOutput] = useState("")
  const [chatOpen, setChatOpen] = useState(false)

  const correctAnswer = "LES PLANTES DE LA VILLE ROSE"
  const encodedMessage = "MFT QMBOUFT EF MB WJMMF SPTF"

  useEffect(() => {
    if (!room || !currentPlayer) {
      router.push("/")
      return
    }

    if (!room.isStarted) {
      router.push("/lobby")
    }
  }, [room, currentPlayer, router])

  const caesarDecode = (text: string, shift = 1) => {
    return text
      .split("")
      .map((char) => {
        if (char.match(/[A-Z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65)
        } else if (char.match(/[a-z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97)
        }
        return char
      })
      .join("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedAnswer = answer.trim().toUpperCase()

    if (normalizedAnswer === correctAnswer) {
      router.push("/enigme-1/livre")
    } else {
      setError("Ce n'est pas le bon titre. Réessayez !")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleDecode = () => {
    const decoded = caesarDecode(decoderInput.toUpperCase())
    setDecoderOutput(decoded)
  }

  if (!room || !currentPlayer) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader enigmeNumber={1} enigmeTitle="Le Livre et le Code" />

      <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mystery-glow mb-4">
            Énigme 1 : Le Livre et le Code
          </h1>
          <p className="text-muted-foreground text-lg">Décodez le titre de l'ouvrage du professeur</p>
        </div>

        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Message codé</h2>
          <div className="bg-muted p-6 rounded-lg border-l-4 border-accent">
            <p className="font-mono text-accent text-xl md:text-2xl text-center tracking-wider">{encodedMessage}</p>
          </div>
          <p className="text-muted-foreground mt-4 text-center italic">
            Indice : Le professeur aimait les codes simples...
          </p>
        </Card>

        <Card className="bg-card border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Outil de décodage</h3>
            <Button variant="outline" size="sm" onClick={() => setShowDecoder(!showDecoder)}>
              {showDecoder ? "Masquer" : "Afficher"}
            </Button>
          </div>

          {showDecoder && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="decoder-input">Texte à décoder (Chiffre de César)</Label>
                <Input
                  id="decoder-input"
                  value={decoderInput}
                  onChange={(e) => setDecoderInput(e.target.value)}
                  placeholder="Entrez le texte codé..."
                  className="font-mono"
                />
              </div>
              <Button onClick={handleDecode} variant="secondary" className="w-full">
                Décoder (décalage de 1)
              </Button>
              {decoderOutput && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Résultat :</p>
                  <p className="font-mono text-lg text-foreground">{decoderOutput}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="answer" className="text-lg">
                Quel est le titre du livre ?
              </Label>
              <Input
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Entrez le titre décodé..."
                className="mt-2 text-lg"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Vérifier la réponse
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
              <p className="text-foreground">
                Le chiffre de César est un code de substitution où chaque lettre est remplacée par une autre lettre
                située à une position fixe dans l'alphabet. Essayez de décaler chaque lettre d'une position vers
                l'arrière (A devient Z, B devient A, etc.).
              </p>
            </Card>
          )}
        </div>
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
