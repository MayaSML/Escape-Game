"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Heart, Leaf, FlaskConical, MapPin, BookOpen, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/game-header"
import { GameChat } from "@/components/game-chat"

export default function FinalePage() {
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
      <GameHeader enigmeNumber={4} enigmeTitle="Mystère Résolu" />

      <div className="max-w-5xl mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <Trophy className="h-24 w-24 text-accent mx-auto animate-bounce" />
            <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-pulse" />
            <Sparkles className="h-6 w-6 text-accent absolute -bottom-1 -left-1 animate-pulse" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mystery-glow mb-4">Mystère Résolu !</h1>
          <p className="text-muted-foreground text-xl">Vous avez découvert le secret du professeur</p>
        </div>

        <Card className="bg-card border-border p-8 md:p-12 mb-8 border-l-4 border-accent">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Leaf className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">La Plante Miraculeuse</h2>
              <p className="text-2xl font-semibold text-accent mb-2">Taxus baccata - L'If commun</p>
            </div>
          </div>

          <div className="space-y-4 text-foreground leading-relaxed">
            <p className="text-lg">
              "Vous avez percé le mystère. Cette plante ancestrale, que l'on trouve ici même au Jardin des Plantes de
              Toulouse, cache en elle un trésor de la médecine moderne."
            </p>
            <p className="text-lg">
              L'if commun contient du <span className="font-semibold text-accent">paclitaxel (Taxol)</span>, une
              molécule utilisée dans le traitement de plusieurs cancers, notamment le{" "}
              <span className="font-semibold text-primary">cancer du sein</span>.
            </p>
            <p className="text-lg italic">
              "La plante apparaît chaque année en Octobre, ici même, dans la ville rose, symbole de vie et d'espoir. Ce
              savoir appartient à tous."
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20 border-pink-300 dark:border-pink-700 p-8 mb-8">
          <div className="text-center mb-6">
            <Heart className="h-12 w-12 text-pink-600 dark:text-pink-400 mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-bold text-pink-900 dark:text-pink-100 mb-2">Octobre Rose</h2>
            <p className="text-pink-700 dark:text-pink-300 text-lg">Mois de sensibilisation au cancer du sein</p>
          </div>
          <p className="text-pink-900 dark:text-pink-100 leading-relaxed text-center">
            Chaque année en octobre, le monde entier se mobilise pour sensibiliser au dépistage et à la recherche contre
            le cancer du sein. Le professeur voulait vous montrer comment la nature et la science travaillent ensemble
            pour sauver des vies.
          </p>
        </Card>

        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">Votre Parcours</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Le Livre et le Code</p>
                <p className="text-sm text-muted-foreground">Vous avez décodé le titre du dernier ouvrage</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FlaskConical className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Double Mission</p>
                <p className="text-sm text-muted-foreground">Collaboration entre Labo et Oncopole</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">La Ville Rose</p>
                <p className="text-sm text-muted-foreground">Localisation du Jardin des Plantes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">L'Herboriste</p>
                <p className="text-sm text-muted-foreground">Identification de Taxus baccata</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-8 mb-8 border-l-4 border-primary">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Message du Professeur Dufour</h2>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>Chers étudiants,</p>
            <p>
              Si vous lisez ces mots, c'est que vous avez réussi. Vous avez compris que la science, la nature et
              l'humanité sont indissociables.
            </p>
            <p>
              Le Taxus baccata pousse depuis des siècles dans notre belle ville de Toulouse. Il était là, sous nos yeux,
              porteur d'espoir pour tant de personnes touchées par le cancer.
            </p>
            <p>
              J'espère que cette quête vous aura appris que les plus grandes découvertes naissent de la curiosité, de la
              collaboration et de la persévérance.
            </p>
            <p className="font-semibold text-primary">
              Continuez à chercher, à questionner, à vous émerveiller. Le monde a besoin de scientifiques comme vous.
            </p>
            <p className="mt-6">Avec toute mon admiration,</p>
            <p className="font-serif text-xl text-primary">Professeur Jean Dufour</p>
          </div>
        </Card>

        <Card className="bg-muted border-border p-8 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">Ce que vous avez appris</h2>
          <div className="space-y-3 text-foreground">
            <p className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span>
                Le <strong>cancer du sein</strong> est le cancer le plus fréquent chez les femmes dans le monde
              </span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span>
                <strong>Octobre Rose</strong> est le mois international de sensibilisation au dépistage
              </span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span>
                Le <strong>Taxol (paclitaxel)</strong> extrait de l'if est utilisé en chimiothérapie
              </span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span>
                La <strong>recherche scientifique</strong> et la <strong>nature</strong> travaillent ensemble pour
                sauver des vies
              </span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-accent font-bold">•</span>
              <span>
                Le <strong>Jardin des Plantes de Toulouse</strong> abrite des trésors botaniques médicinaux
              </span>
            </p>
          </div>
        </Card>

        <div className="text-center space-y-4">
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Recommencer l'aventure
          </Button>
          <p className="text-sm text-muted-foreground">
            Partagez cette expérience et sensibilisez autour de vous à Octobre Rose
          </p>
        </div>
      </div>

      <GameChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
