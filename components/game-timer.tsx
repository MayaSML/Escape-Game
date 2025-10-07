"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface GameTimerProps {
  startTime: number
  enigmeNumber?: number
}

export function GameTimer({ startTime, enigmeNumber }: GameTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const diff = now - startTime
      setElapsed(diff)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="bg-card border-border p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          {enigmeNumber && <p className="text-xs text-muted-foreground">Énigme {enigmeNumber}</p>}
          <p className="text-2xl font-mono font-bold text-foreground">{formatTime(elapsed)}</p>
        </div>
      </div>
    </Card>
  )
}
