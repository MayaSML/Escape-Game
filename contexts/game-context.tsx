"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { type GameRoom, type Player, type ChatMessage, GameStore } from "@/lib/game-store"

interface GameContextType {
  room: GameRoom | null
  currentPlayer: Player | null
  players: Player[]
  chatMessages: ChatMessage[]
  refreshRoom: () => void
  sendMessage: (message: string) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<GameRoom | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const supabase = createClient()

  const refreshRoom = async () => {
    if (typeof window === "undefined") return

    const roomId = sessionStorage.getItem("currentRoomId")
    const playerId = sessionStorage.getItem("currentPlayerId")

    if (roomId) {
      const updatedRoom = await GameStore.getRoom(roomId)
      setRoom(updatedRoom)

      const updatedPlayers = await GameStore.getPlayers(roomId)
      setPlayers(updatedPlayers)

      if (playerId) {
        const player = await GameStore.getPlayer(playerId)
        setCurrentPlayer(player)
      }

      const messages = await GameStore.getChatMessages(roomId)
      setChatMessages(messages)
    }
  }

  const sendMessage = async (message: string) => {
    if (!room || !currentPlayer) return
    await GameStore.sendChatMessage(room.id, currentPlayer.id, currentPlayer.name, currentPlayer.color, message)
  }

  useEffect(() => {
    const tryLoad = async () => {
    const roomId = sessionStorage.getItem("currentRoomId")
    const playerId = sessionStorage.getItem("currentPlayerId")

    if (roomId && playerId) {
      await refreshRoom()
    } else {
      // Réessayer dans 500ms tant que les IDs ne sont pas disponibles
      setTimeout(tryLoad, 500)
    }
    }
    tryLoad()

    const roomId = sessionStorage.getItem("currentRoomId")
    if (!roomId) return

    // Subscribe to room changes
    const roomChannel = supabase
      .channel(`room:${roomId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "game_rooms", filter: `id=eq.${roomId}` }, () => {
        refreshRoom()
      })
      .subscribe()

    // Subscribe to players changes
    const playersChannel = supabase
      .channel(`players:${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` },
        () => {
          refreshRoom()
        },
      )
      .subscribe()

    // Subscribe to chat messages
    const chatChannel = supabase
      .channel(`chat:${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
        () => {
          refreshRoom()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(roomChannel)
      supabase.removeChannel(playersChannel)
      supabase.removeChannel(chatChannel)
    }
  }, [])

  return (
    <GameContext.Provider value={{ room, currentPlayer, players, chatMessages, refreshRoom, sendMessage }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
