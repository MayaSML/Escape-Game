"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGame } from "@/contexts/game-context"
import { GameStore } from "@/lib/game-store"
import { Copy, Check, Users, Crown, ArrowRight, LogOut } from "lucide-react"

export default function AuthLoginPage() {
  const router = useRouter()
  const { room, currentPlayer, players } = useGame()
  const [copied, setCopied] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    // Redirect to home if no room or player
    if (!room || !currentPlayer) {
      router.push("/")
      return
    }

    // Redirect to briefing if game has started
    if (room.status === "playing") {
      router.push("/briefing")
    }
  }, [room, currentPlayer, router])

  const copyRoomCode = async () => {
    if (room) {
      await navigator.clipboard.writeText(room.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const startGame = async () => {
    if (!room || !currentPlayer) return

    // Check if current player is host
    if (room.host_id !== currentPlayer.id) {
      alert("Seul l'hôte peut démarrer la partie")
      return
    }

    // Check minimum players
    if (players.length < 2) {
      alert("Il faut au moins 2 joueurs pour commencer")
      return
    }

    setIsStarting(true)
    try {
      await GameStore.startGame(room.id)
      router.push("/briefing")
    } catch (error) {
      console.error("[v0] Error starting game:", error)
      alert("Erreur lors du démarrage de la partie")
      setIsStarting(false)
    }
  }

  const leaveRoom = () => {
    if (confirm("Voulez-vous vraiment quitter la partie ?")) {
      router.push("/")
    }
  }

  if (!room || !currentPlayer) {
    return null
  }

  const isHost = room.host_id === currentPlayer.id
  const canStart = players.length >= 2 && players.length <= 4

  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255, 105, 180, 0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 mystery-glow text-primary">
              Salle d'attente
            </h1>
            <p className="text-lg text-muted-foreground">Escape Game - Octobre Rose</p>
          </div>

          {/* Room Code Card */}
          <Card className="bg-card border-border p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Code de la partie</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-3xl font-mono font-bold text-primary bg-primary/10 px-8 py-4 rounded-lg tracking-wider">
                  {room.code}
                </code>
                <Button
                  onClick={copyRoomCode}
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 bg-transparent"
                  title="Copier le code"
                >
                  {copied ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Partagez ce code avec vos coéquipiers pour qu'ils rejoignent la partie
              </p>
            </div>
          </Card>

          {/* Players Card */}
          <Card className="bg-card border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-bold text-foreground">Groupe actuel</h3>
              </div>
              <span className="text-sm font-semibold text-muted-foreground">{players.length}/4 joueurs</span>
            </div>

            <div className="space-y-3">
              {players.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">En attente de joueurs...</p>
              ) : (
                players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50 transition-colors hover:bg-background/80"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-lg">{player.name}</p>
                          {player.is_host && <Crown className="h-5 w-5 text-yellow-500" title="Hôte" />}
                          {player.id === currentPlayer.id && (
                            <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded">Vous</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {player.is_host ? "Hôte de la partie" : "Joueur"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isHost && (
              <Button
                onClick={startGame}
                disabled={!canStart || isStarting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14"
                size="lg"
              >
                {isStarting ? (
                  "Démarrage..."
                ) : (
                  <>
                    Lancer la partie
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>
            )}

            {!isHost && (
              <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">En attente que l'hôte démarre la partie...</p>
              </div>
            )}

            {!canStart && isHost && (
              <p className="text-center text-sm text-muted-foreground">
                {players.length < 2
                  ? "⚠️ Il faut au moins 2 joueurs pour commencer"
                  : players.length > 4
                    ? "⚠️ Maximum 4 joueurs autorisés"
                    : "Prêt à commencer !"}
              </p>
            )}

            <Button onClick={leaveRoom} variant="outline" className="w-full bg-transparent" size="lg">
              <LogOut className="mr-2 h-5 w-5" />
              Quitter la partie
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
