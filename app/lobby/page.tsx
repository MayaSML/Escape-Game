"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGame } from "@/contexts/game-context"
import { Copy, Check, Users, Crown, ArrowRight } from "lucide-react"

export default function LobbyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { room, currentPlayer, players, refreshRoom } = useGame()
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] Lobby: room =", room)
    console.log("[v0] Lobby: currentPlayer =", currentPlayer)
    console.log("[v0] Lobby: players =", players)

    if (!room || !currentPlayer) {
      router.push("/")
      return
    }

    if (room.status === "playing") {
      router.push("/briefing")
      return
    }

    setIsLoading(false)
  }, [room, currentPlayer, players, router])

  const copyRoomCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const startGame = async () => {
    if (room && players.length >= 2 && players.length <= 4) {
      const { GameStore } = await import("@/lib/game-store")
      await GameStore.startGame(room.id)
      await refreshRoom()
      router.push("/briefing")
    }
  }

  if (isLoading || !room || !currentPlayer || players.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de la salle d'attente...</p>
        </div>
      </div>
    )
  }

  const isHost = room.host_id === currentPlayer.id
  const canStart = players.length >= 2 && players.length <= room.max_players

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

          {/* Room Code */}
          <Card className="bg-card border-border p-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Code de la partie</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-2xl font-mono font-bold text-primary bg-primary/10 px-6 py-3 rounded-lg">
                  {room.code}
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
                Joueurs ({players.length}/{room.max_players})
              </h3>
            </div>

            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{player.name}</p>
                        {player.is_host && <Crown className="h-4 w-4 text-yellow-500" />}
                        {player.id === currentPlayer.id && (
                          <span className="text-xs text-muted-foreground">(Vous)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
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

            {!isHost && <p className="text-center text-muted-foreground">En attente que l'hôte lance la partie...</p>}

            {isHost && !canStart && (
              <p className="text-center text-sm text-muted-foreground">
                {players.length < 2 ? "En attente d'au moins 2 joueurs..." : `Maximum ${room.max_players} joueurs`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
