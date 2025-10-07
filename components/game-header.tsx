"use client"

import { useGame } from "@/contexts/game-context"
import { GameTimer } from "./game-timer"
import { Users } from "lucide-react"
import { Card } from "./ui/card"

interface GameHeaderProps {
  enigmeNumber: number
  enigmeTitle: string
}

export function GameHeader({ enigmeNumber, enigmeTitle }: GameHeaderProps) {
  const { room } = useGame()

  if (!room) return null

  const enigmeStartTime = room.enigmeStartTimes[enigmeNumber] || Date.now()

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{enigmeTitle}</h2>
          <p className="text-sm text-muted-foreground">Énigme {enigmeNumber} / 4</p>
        </div>

        <div className="flex items-center gap-3">
          <Card className="bg-card border-border p-3 hidden md:flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            <div className="flex -space-x-2">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className="h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: player.color }}
                  title={player.name}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </Card>

          <GameTimer startTime={enigmeStartTime} enigmeNumber={enigmeNumber} />
        </div>
      </div>
    </div>
  )
}
