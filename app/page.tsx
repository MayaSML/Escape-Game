"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Users, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { GameStore } from "@/lib/game-store"

export default function HomePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError("Veuillez entrer votre nom")
      return
    }

    setIsCreating(true)
    setError("")

    try {
      console.log("[v0] handleCreateRoom: Starting room creation...")
      const { room, player } = await GameStore.createRoom(playerName.trim())
      console.log("[v0] handleCreateRoom: Room created, redirecting to lobby...")
      console.log("[v0] handleCreateRoom: Room data:", room)
      console.log("[v0] handleCreateRoom: Player data:", player)
      router.push("/auth/login")
      console.log("[v0] handleCreateRoom: router.push called")
    } catch (err) {
      console.error("[v0] handleCreateRoom: Error caught:", err)
      setError("Erreur lors de la création de la partie")
      console.error(err)
    } finally {
      console.log("[v0] handleCreateRoom: Finally block")
      setIsCreating(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError("Veuillez entrer votre nom")
      return
    }

    if (!roomCode.trim()) {
      setError("Veuillez entrer un code de partie")
      return
    }

    setIsJoining(true)
    setError("")

    try {
      const { room, player } = await GameStore.joinRoom(roomCode.trim(), playerName.trim())
      router.push("/auth/login")
    } catch (err: any) {
      setError(err.message || "Impossible de rejoindre cette partie")
      console.error(err)
    } finally {
      setIsJoining(false)
    }
  }

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

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 mystery-glow text-primary">Le Mystère</h1>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent accent-glow mb-6">
              de la Plante Rose
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Un éminent professeur toulousain a disparu. Réunissez votre équipe de 2 à 4 joueurs pour résoudre les
              énigmes.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Create Room */}
            <Card className="bg-card border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Créer une partie</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-player-name">Votre nom</Label>
                  <Input
                    id="create-player-name"
                    placeholder="Entrez votre nom"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value)
                      setError("")
                    }}
                    className="mt-1"
                    disabled={isCreating}
                  />
                </div>

                <Button
                  onClick={handleCreateRoom}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                  disabled={isCreating || !playerName.trim()}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      Créer la partie
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Join Room */}
            <Card className="bg-card border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Rejoindre une partie</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="join-player-name">Votre nom</Label>
                  <Input
                    id="join-player-name"
                    placeholder="Entrez votre nom"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value)
                      setError("")
                    }}
                    className="mt-1"
                    disabled={isJoining}
                  />
                </div>

                <div>
                  <Label htmlFor="room-code">Code de la partie</Label>
                  <Input
                    id="room-code"
                    placeholder="Ex: ABC123"
                    value={roomCode}
                    onChange={(e) => {
                      setRoomCode(e.target.value.toUpperCase())
                      setError("")
                    }}
                    className="mt-1"
                    disabled={isJoining}
                    maxLength={6}
                  />
                </div>

                <Button
                  onClick={handleJoinRoom}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                  disabled={isJoining || !playerName.trim() || !roomCode.trim()}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      Rejoindre
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 max-w-4xl mx-auto">
              <Card className="bg-destructive/10 border-destructive p-4">
                <p className="text-destructive text-center">{error}</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
