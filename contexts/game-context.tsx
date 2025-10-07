// game-context.tsx
"use client"

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { type GameRoom, type Player, type ChatMessage, GameStore } from "@/lib/game-store"

interface GameContextType {
  room: GameRoom | null
  currentPlayer: Player | null
  players: Player[]
  chatMessages: ChatMessage[]
  refreshRoom: () => Promise<boolean>
  sendMessage: (message: string) => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<GameRoom | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const supabase = useMemo(() => createClient(), [])

  const refreshRoom = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false

    const roomId = sessionStorage.getItem("currentRoomId")
    const playerId = sessionStorage.getItem("currentPlayerId")

    console.log("[refreshRoom] sessionStorage roomId =", roomId, "playerId =", playerId)

    if (!roomId || !playerId) {
      console.log("[refreshRoom] IDs manquants, reset du contexte")
      setRoom(null)
      setPlayers([])
      setCurrentPlayer(null)
      setChatMessages([])
      return false
    }

    try {
      const updatedRoom = await GameStore.getRoom(roomId)
      console.log("[refreshRoom] room fetched:", updatedRoom)
      setRoom(updatedRoom ?? null)

      const updatedPlayers = await GameStore.getPlayers(roomId)
      console.log("[refreshRoom] players fetched:", updatedPlayers)
      setPlayers(updatedPlayers ?? [])

      const player = await GameStore.getPlayer(playerId)
      console.log("[refreshRoom] currentPlayer fetched:", player)
      setCurrentPlayer(player ?? null)

      const messages = await GameStore.getChatMessages(roomId)
      setChatMessages(messages ?? [])

      const ok = !!updatedRoom && !!player
      console.log("[refreshRoom] success =", ok)
      return ok
    } catch (error) {
      console.error("[refreshRoom] erreur lors de la récupération des données :", error)
      return false
    }
  }

  const sendMessage = async (message: string) => {
    if (!room || !currentPlayer) return
    await GameStore.sendChatMessage(room.id, currentPlayer.id, currentPlayer.name, currentPlayer.color, message)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    let roomChannel: any = null
    let playersChannel: any = null
    let chatChannel: any = null
    let cancelled = false

    const setupRealtime = async () => {
      // attendre que sessionStorage soit possiblement écrit
      let roomId = sessionStorage.getItem("currentRoomId")
      let playerId = sessionStorage.getItem("currentPlayerId")
      let tries = 0
      while ((!roomId || !playerId) && tries < 10 && !cancelled) {
        await new Promise((r) => setTimeout(r, 100))
        roomId = sessionStorage.getItem("currentRoomId")
        playerId = sessionStorage.getItem("currentPlayerId")
        tries++
      }

      if (!roomId || !playerId) {
        console.warn("[GameProvider] Pas d'IDs trouvé après attente — pas d'abonnement Realtime")
        return
      }

      try {
        const ok = await refreshRoom()
        console.log("[GameProvider] refreshRoom initial returned", ok)
      } catch (err) {
        console.error("[GameProvider] refreshRoom failed:", err)
      }

      // créer channels et logguer les payloads
      roomChannel = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "game_rooms", filter: `id=eq.${roomId}` },
          (payload) => {
            console.log("[supabase] room change:", payload)
            refreshRoom()
          },
        )
        .subscribe()

      playersChannel = supabase
        .channel(`players:${roomId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` },
          (payload) => {
            console.log("[supabase] players change:", payload)
            refreshRoom()
          },
        )
        .subscribe()

      chatChannel = supabase
        .channel(`chat:${roomId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
          (payload) => {
            console.log("[supabase] chat insert:", payload)
            refreshRoom()
          },
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      cancelled = true
      if (roomChannel) supabase.removeChannel(roomChannel)
      if (playersChannel) supabase.removeChannel(playersChannel)
      if (chatChannel) supabase.removeChannel(chatChannel)
    }
  }, [supabase]) // supabase memo

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
