"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGame } from "@/contexts/game-context"
import { GameStore } from "@/lib/game-store"
import { Copy, Check, Users, Crown, ArrowRight } from "lucide-react"

export default function LobbyPage() {
  const router = useRouter()
  const { room, currentPlayer, refreshRoom } = useGame()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!room || !currentPlayer) {
      router.push("/")
      return
    }

    // Check if game has started
    if (room.isStarted) {
      router.push("/briefing")
    }
  }, [room, currentPlayer, router])

  const copyRoomCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const toggleReady = () => {
    if (room && currentPlayer) {
      GameStore.togglePlayerReady(room.id, currentPlayer.id)
      refreshRoom()
    }
  }

  const startGame = () => {
    if (room && room.players.length >= 2) {
      const allReady = room.players.every((p) => p.isReady)
      if (allReady) {
        GameStore.startGame(room.id)
        refreshRoom()
      }
    }
  }

  if (!room || !currentPlayer) {
    return null
  }

  const isHost = room.players[0].id === currentPlayer.id
  const allReady = room.players.every((p) => p.isReady)
  const canStart = room.players.length >= 2 && allReady

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
            <p className="text-lg text-muted-foreground">{room.name}</p>
          </div>

          {/* Room Code */}
          <Card className="bg-card border-border p-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Code de la partie</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-2xl font-mono font-bold text-primary bg-primary/10 px-6 py-3 rounded-lg">
                  {room.id.split("-")[1]}
                </code>
                <Button onClick={copyRoomCode} variant="outline" size="icon" className="h-12 w-12 bg-transparent">
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Partagez ce code avec vos coéquipiers</p>
            </div>
          </Card>

          {/* Players */}
          <Card className="bg-card border-border p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-accent" />
              <h3 className="text-xl font-bold text-foreground">
                Joueurs ({room.players.length}/{room.maxPlayers})
              </h3>
            </div>

            <div className="space-y-3">
              {room.players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{player.name}</p>
                        {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                        {player.id === currentPlayer.id && (
                          <span className="text-xs text-muted-foreground">(Vous)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {player.isReady ? (
                      <span className="text-sm font-semibold text-green-500">Prêt</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">En attente...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={toggleReady}
              className={`w-full ${
                currentPlayer.isReady ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
              } text-white`}
              size="lg"
            >
              {currentPlayer.isReady ? "Annuler" : "Je suis prêt !"}
            </Button>

            {isHost && (
              <Button
                onClick={startGame}
                disabled={!canStart}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                Commencer l'aventure
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {!canStart && (
              <p className="text-center text-sm text-muted-foreground">
                {room.players.length < 2
                  ? "En attente d'au moins 2 joueurs..."
                  : "Tous les joueurs doivent être prêts pour commencer"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
