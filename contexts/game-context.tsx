"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { type GameRoom, type Player, type ChatMessage, GameStore } from "@/lib/game-store"

interface GameContextType {
  room: GameRoom | null
  currentPlayer: Player | null
  players: Player[]
  chatMessages: ChatMessage[]
  refreshRoom: () => Promise<void>
  sendMessage: (message: string) => Promise<void>
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

    console.log("[refreshRoom] sessionStorage roomId =", roomId, "playerId =", playerId)

    if (!roomId || !playerId) {
      console.log("[refreshRoom] IDs manquants, reset du contexte")
      setRoom(null)
      setPlayers([])
      setCurrentPlayer(null)
      setChatMessages([])
      return
    }

    try {
      const updatedRoom = await GameStore.getRoom(roomId)
      console.log("[refreshRoom] room fetched:", updatedRoom)
      setRoom(updatedRoom)

      const updatedPlayers = await GameStore.getPlayers(roomId)
      console.log("[refreshRoom] players fetched:", updatedPlayers)
      setPlayers(updatedPlayers)

      const player = await GameStore.getPlayer(playerId)
      console.log("[refreshRoom] currentPlayer fetched:", player)
      setCurrentPlayer(player)

      const messages = await GameStore.getChatMessages(roomId)
      setChatMessages(messages)
    } catch (error) {
      console.error("[refreshRoom] erreur lors de la récupération des données :", error)
    }
  }

  const sendMessage = async (message: string) => {
    if (!room || !currentPlayer) return
    await GameStore.sendChatMessage(room.id, currentPlayer.id, currentPlayer.name, currentPlayer.color, message)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const initialize = async () => {
      await refreshRoom()

      const roomId = sessionStorage.getItem("currentRoomId")
      if (!roomId) return

      const roomChannel = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "game_rooms", filter: `id=eq.${roomId}` },
          () => {
            console.log("[supabase] Mise à jour room détectée")
            refreshRoom()
          },
        )
        .subscribe()

      const playersChannel = supabase
        .channel(`players:${roomId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` },
          () => {
            console.log("[supabase] Mise à jour players détectée")
            refreshRoom()
          },
        )
        .subscribe()

      const chatChannel = supabase
        .channel(`chat:${roomId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
          () => {
            console.log("[supabase] Nouveau message détecté")
            refreshRoom()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(roomChannel)
        supabase.removeChannel(playersChannel)
        supabase.removeChannel(chatChannel)
      }
    }

    initialize()
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
