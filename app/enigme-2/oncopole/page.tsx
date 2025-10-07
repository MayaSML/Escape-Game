"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Hospital, Lightbulb, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function OncopoleP() {
  const router = useRouter()
  const { room, currentPlayer } = useGame()
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" })
  const [code, setCode] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState("")
  const [chatOpen, setChatOpen] = useState(false)

  const correctAnswers = {
    q1: "SEIN",
    q2: "OCTOBRE",
    q3: "ROSE",
  }
  const correctCode = "1031"

  useEffect(() => {
    if (!room || !currentPlayer) {
      router.push("/")
      return
    }

    if (!room.isStarted) {
      router.push("/lobby")
    }
  }, [room, currentPlayer, router])

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers({ ...answers, [question]: value.toUpperCase() })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allCorrect =
      answers.q1 === correctAnswers.q1 && answers.q2 === correctAnswers.q2 && answers.q3 === correctAnswers.q3

    if (allCorrect && code === correctCode) {
      setUnlocked(true)
    } else {
      setError("Les réponses ou le code sont incorrects. Réessayez.")
      setTimeout(() => setError(""), 3000)
    }
  }

  if (!room || !currentPlayer) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader enigmeNumber={2} enigmeTitle="Mission Oncopole" />

      <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
        {/* Header */}
        <div className="text-center mb-12">
          <Hospital className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mystery-glow mb-4">Mission Oncopole</h1>
          <p className="text-muted-foreground text-lg">Analyser les documents médicaux</p>
        </div>

        {!unlocked ? (
          <>
            {/* Medical Document */}
            <Card className="bg-card border-border p-8 mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Dossier médical</h2>
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-foreground font-semibold mb-2">Extrait du rapport :</p>
                  <p className="text-foreground leading-relaxed">
                    "Cette pathologie touche principalement les femmes, bien que les hommes puissent également être
                    affectés. Elle se développe dans les tissus mammaires et représente le cancer le plus fréquent chez
                    les femmes dans le monde."
                  </p>
                </div>

                <div className="bg-background p-4 rounded border border-border">
                  <p className="text-foreground font-semibold mb-3">Affiche de sensibilisation :</p>
                  <div className="bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900/20 dark:to-pink-800/20 p-6 rounded-lg text-center border-2 border-pink-300 dark:border-pink-700">
                    <p className="text-4xl mb-2">🎀</p>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                      Mois de sensibilisation au cancer du ____
                    </p>
                    <p className="text-lg text-pink-700 dark:text-pink-300">_______ Rose</p>
                    <p className="text-sm text-pink-600 dark:text-pink-400 mt-2">Symbole : Ruban ____</p>
                  </div>
                </div>

                <div className="bg-background p-4 rounded border border-border">
                  <p className="text-foreground font-semibold mb-2">Note du professeur :</p>
                  <p className="text-foreground italic">
                    "Le code pour déverrouiller les découvertes est identique à celui de l'équipe Laboratoire. La
                    collaboration est essentielle."
                  </p>
                </div>
              </div>
            </Card>

            {/* Questions Form */}
            <Card className="bg-card border-border p-8 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="q1" className="text-lg">
                    1. Quel type de cancer est décrit dans le rapport ?
                  </Label>
                  <Input
                    id="q1"
                    value={answers.q1}
                    onChange={(e) => handleAnswerChange("q1", e.target.value)}
                    placeholder="Cancer du..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="q2" className="text-lg">
                    2. Quel est le mois de sensibilisation ?
                  </Label>
                  <Input
                    id="q2"
                    value={answers.q2}
                    onChange={(e) => handleAnswerChange("q2", e.target.value)}
                    placeholder="Mois..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="q3" className="text-lg">
                    3. Quelle est la couleur du symbole ?
                  </Label>
                  <Input
                    id="q3"
                    value={answers.q3}
                    onChange={(e) => handleAnswerChange("q3", e.target.value)}
                    placeholder="Couleur..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="code" className="text-lg">
                    Code du cadenas (partagé par l'équipe Labo)
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                    <Input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="####"
                      maxLength={4}
                      className="font-mono text-2xl text-center"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Déverrouiller le cadenas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Card>

            {/* Hint */}
            <div className="text-center">
              <Button variant="ghost" onClick={() => setShowHint(!showHint)} className="text-muted-foreground">
                <Lightbulb className="mr-2 h-4 w-4" />
                {showHint ? "Masquer l'indice" : "Besoin d'un indice ?"}
              </Button>
              {showHint && (
                <Card className="bg-muted border-border p-6 mt-4">
                  <p className="text-foreground">
                    Regardez attentivement l'affiche de sensibilisation. Les mots manquants sont liés à une campagne
                    mondiale de sensibilisation qui a lieu chaque année en automne.
                  </p>
                </Card>
              )}
            </div>
          </>
        ) : (
          <Card className="bg-card border-border p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Cadenas déverrouillé !</h2>
              <p className="text-muted-foreground mb-6">
                Vous avez identifié la maladie : <span className="font-semibold text-primary">Cancer du sein</span>
              </p>
              <p className="text-foreground leading-relaxed">
                Bravo ! Vous avez découvert que le professeur étudiait le cancer du sein, une maladie qui touche des
                milliers de personnes. Octobre Rose est le mois de sensibilisation à cette cause.
              </p>
            </div>
            <Button
              onClick={() => router.push("/enigme-2/reunion")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Rejoindre l'équipe Laboratoire
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        )}
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
