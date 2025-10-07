"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, FlaskConical, Lightbulb, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function LaboPage() {
  const router = useRouter()
  const { room, currentPlayer } = useGame()
  const [sequence, setSequence] = useState(["", "", "", ""])
  const [code, setCode] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState("")
  const [chatOpen, setChatOpen] = useState(false)

  const correctSequence = ["ATCG", "CGTA", "TACG", "GCTA"]
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

  const handleSequenceChange = (index: number, value: string) => {
    const newSequence = [...sequence]
    newSequence[index] = value.toUpperCase()
    setSequence(newSequence)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isSequenceCorrect = sequence.every((seq, idx) => seq === correctSequence[idx])

    if (isSequenceCorrect && code === correctCode) {
      setUnlocked(true)
    } else {
      setError("La séquence ou le code est incorrect. Vérifiez vos données.")
      setTimeout(() => setError(""), 3000)
    }
  }

  if (!room || !currentPlayer) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader enigmeNumber={2} enigmeTitle="Mission Laboratoire" />

      <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
        {/* Header */}
        <div className="text-center mb-12">
          <FlaskConical className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mystery-glow mb-4">
            Mission Laboratoire
          </h1>
          <p className="text-muted-foreground text-lg">Reconstituer la séquence ADN</p>
        </div>

        {!unlocked ? (
          <>
            {/* Research Document */}
            <Card className="bg-card border-border p-8 mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Document de recherche</h2>
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <p className="text-foreground">
                  <span className="font-semibold">Extrait du journal de recherche :</span>
                </p>
                <p className="text-foreground leading-relaxed">
                  "Les mutations génétiques dans les gènes BRCA1 et BRCA2 augmentent considérablement le risque. Nos
                  analyses montrent une séquence particulière qui apparaît systématiquement dans nos échantillons."
                </p>
                <div className="bg-background p-4 rounded border border-border">
                  <p className="font-mono text-sm text-foreground mb-2">Séquence fragmentée détectée :</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-accent/20 p-2 rounded">Fragment 1: AT_G</div>
                    <div className="bg-accent/20 p-2 rounded">Fragment 2: CG_A</div>
                    <div className="bg-accent/20 p-2 rounded">Fragment 3: TA_G</div>
                    <div className="bg-accent/20 p-2 rounded">Fragment 4: GC_A</div>
                  </div>
                  <p className="text-muted-foreground mt-3 text-xs">
                    Note : Les bases manquantes (représentées par _) doivent être déduites selon les règles
                    d'appariement Watson-Crick.
                  </p>
                </div>
                <p className="text-foreground">
                  "Le mois de sensibilisation commence toujours le premier jour et dure tout le mois. Le code est :
                  [mois][nombre de jours]"
                </p>
              </div>
            </Card>

            {/* DNA Sequence Form */}
            <Card className="bg-card border-border p-8 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-lg mb-4 block">Reconstituer la séquence complète (4 bases par fragment)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sequence.map((seq, idx) => (
                      <div key={idx}>
                        <Label htmlFor={`seq-${idx}`} className="text-sm text-muted-foreground">
                          Fragment {idx + 1}
                        </Label>
                        <Input
                          id={`seq-${idx}`}
                          value={seq}
                          onChange={(e) => handleSequenceChange(idx, e.target.value)}
                          placeholder="XXXX"
                          maxLength={4}
                          className="font-mono text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="code" className="text-lg">
                    Code du cadenas (4 chiffres)
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

                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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
                  <p className="text-foreground mb-2">
                    <strong>Indice ADN :</strong> Dans l'ADN, A s'apparie avec T, et C s'apparie avec G.
                  </p>
                  <p className="text-foreground">
                    <strong>Indice code :</strong> Octobre est le 10ème mois. Combien de jours compte octobre ?
                  </p>
                </Card>
              )}
            </div>
          </>
        ) : (
          <Card className="bg-card border-border p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-10 w-10 text-accent" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Cadenas déverrouillé !</h2>
              <p className="text-muted-foreground mb-6">
                Vous avez trouvé le code : <span className="font-mono text-2xl text-accent">{correctCode}</span>
              </p>
              <p className="text-foreground leading-relaxed">
                Excellent travail ! Vous avez identifié la séquence ADN liée aux mutations BRCA. Partagez ce code avec
                l'équipe Oncopole pour progresser ensemble.
              </p>
            </div>
            <Button
              onClick={() => router.push("/enigme-2/reunion")}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Rejoindre l'équipe Oncopole
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        )}
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
