import { createClient } from "@/lib/supabase/client"

export interface Player {
  id: string
  room_id: string
  name: string
  color: string
  avatar: string
  is_host: boolean
  team?: "labo" | "oncopole" | null
  joined_at: string
}

export interface GameRoom {
  id: string
  code: string
  host_id: string | null
  status: "waiting" | "playing" | "completed"
  current_enigma: number
  max_players: number
  created_at: string
}

export interface ChatMessage {
  id: string
  room_id: string
  player_id: string
  player_name: string
  player_color: string
  message: string
  created_at: string
}

export interface EnigmaProgress {
  id: string
  room_id: string
  enigma_number: number
  started_at: string
  completed_at?: string
  time_spent?: number
}

// Player colors and avatars for visual distinction
export const PLAYER_COLORS = ["#FF69B4", "#4ECDC4", "#FFD93D", "#A78BFA"]

export const PLAYER_AVATARS = ["🎭", "🎨", "🎪", "🎬"]

export class GameStore {
  // Generate a unique 6-character room code
  static generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Create a new game room
  static async createRoom(playerName: string): Promise<{ room: GameRoom; player: Player }> {
    console.log("[v0] Creating room for player:", playerName)
    const supabase = createClient()
    const code = this.generateRoomCode()
    console.log("[v0] Generated room code:", code)

    console.log("[v0] Inserting room into database...")
    const { data: room, error: roomError } = await supabase
      .from("game_rooms")
      .insert({
        code,
        status: "waiting",
        current_enigma: 0,
        max_players: 4,
        host_id: null, // Will be updated after player creation
      })
      .select()
      .single()

    if (roomError) {
      console.error("[v0] Room creation error:", roomError)
      throw roomError
    }
    console.log("[v0] Room created successfully:", room)

    console.log("[v0] Creating host player...")
    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        room_id: room.id,
        name: playerName,
        color: PLAYER_COLORS[0],
        avatar: PLAYER_AVATARS[0],
        is_host: true,
      })
      .select()
      .single()

    if (playerError) {
      console.error("[v0] Player creation error:", playerError)
      await supabase.from("game_rooms").delete().eq("id", room.id)
      throw playerError
    }
    console.log("[v0] Player created successfully:", player)

    console.log("[v0] Updating room with host_id...")
    const { error: updateError } = await supabase.from("game_rooms").update({ host_id: player.id }).eq("id", room.id)

    if (updateError) {
      console.error("[v0] Room update error:", updateError)
    }

    // Store in session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentRoomId", room.id)
      sessionStorage.setItem("currentPlayerId", player.id)
      console.log("[v0] Session storage updated")
    }

    console.log("[v0] createRoom: Returning room and player data")
    return { room: { ...room, host_id: player.id }, player }
  }

  // Join an existing room by code
  static async joinRoom(code: string, playerName: string): Promise<{ room: GameRoom; player: Player }> {
    console.log("[v0] joinRoom: Starting to join room with code:", code)
    const supabase = createClient()

    // Find room by code
    console.log("[v0] joinRoom: Searching for room...")
    const { data: room, error: roomError } = await supabase
      .from("game_rooms")
      .select("*")
      .eq("code", code.toUpperCase())
      .single()

    if (roomError) {
      console.error("[v0] joinRoom: Room not found error:", roomError)
      throw new Error("Partie introuvable. Vérifiez le code.")
    }
    console.log("[v0] joinRoom: Room found:", room)

    // Check if room is full
    console.log("[v0] joinRoom: Checking room capacity...")
    const { data: players } = await supabase.from("players").select("*").eq("room_id", room.id)
    console.log("[v0] joinRoom: Current players:", players)

    if (players && players.length >= room.max_players) {
      console.error("[v0] joinRoom: Room is full")
      throw new Error("La partie est complète (4 joueurs maximum)")
    }

    if (room.status !== "waiting") {
      console.error("[v0] joinRoom: Game already started")
      throw new Error("La partie a déjà commencé")
    }

    // Create player
    const playerIndex = players?.length || 0
    console.log("[v0] joinRoom: Creating player at index:", playerIndex)
    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        room_id: room.id,
        name: playerName,
        color: PLAYER_COLORS[playerIndex % PLAYER_COLORS.length],
        avatar: PLAYER_AVATARS[playerIndex % PLAYER_AVATARS.length],
        is_host: false,
      })
      .select()
      .single()

    if (playerError) {
      console.error("[v0] joinRoom: Player creation error:", playerError)
      throw playerError
    }
    console.log("[v0] joinRoom: Player created successfully:", player)

    // Store in session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentRoomId", room.id)
      sessionStorage.setItem("currentPlayerId", player.id)
      console.log("[v0] joinRoom: Session storage updated")
    }

    console.log("[v0] joinRoom: Returning room and player data")
    return { room, player }
  }

  // Get room by ID
  static async getRoom(roomId: string): Promise<GameRoom | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("game_rooms").select("*").eq("id", roomId).single()

    if (error) return null
    return data
  }

  // Get all players in a room
  static async getPlayers(roomId: string): Promise<Player[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("players").select("*").eq("room_id", roomId).order("joined_at")

    if (error) return []
    return data
  }

  // Get a specific player
  static async getPlayer(playerId: string): Promise<Player | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("players").select("*").eq("id", playerId).single()

    if (error) return null
    return data
  }

  // Update room status
  static async updateRoom(roomId: string, updates: Partial<GameRoom>): Promise<void> {
    const supabase = createClient()
    await supabase.from("game_rooms").update(updates).eq("id", roomId)
  }

  // Start the game
  static async startGame(roomId: string): Promise<void> {
    const supabase = createClient()

    // Update room status
    await supabase.from("game_rooms").update({ status: "playing", current_enigma: 1 }).eq("id", roomId)

    // Create enigma progress
    await supabase.from("enigma_progress").insert({
      room_id: roomId,
      enigma_number: 1,
    })
  }

  // Advance to next enigma
  static async advanceEnigma(roomId: string, currentEnigma: number): Promise<void> {
    const supabase = createClient()

    // Mark current enigma as completed
    const { data: progress } = await supabase
      .from("enigma_progress")
      .select("*")
      .eq("room_id", roomId)
      .eq("enigma_number", currentEnigma)
      .single()

    if (progress) {
      const startTime = new Date(progress.started_at).getTime()
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)

      await supabase
        .from("enigma_progress")
        .update({
          completed_at: new Date().toISOString(),
          time_spent: timeSpent,
        })
        .eq("id", progress.id)
    }

    // Update room to next enigma
    const nextEnigma = currentEnigma + 1
    await supabase.from("game_rooms").update({ current_enigma: nextEnigma }).eq("id", roomId)

    // Create next enigma progress
    await supabase.from("enigma_progress").insert({
      room_id: roomId,
      enigma_number: nextEnigma,
    })
  }

  // Assign teams for enigma 2
  static async assignTeams(roomId: string): Promise<void> {
    const supabase = createClient()
    const players = await this.getPlayers(roomId)

    // Split players into two teams
    const halfPoint = Math.ceil(players.length / 2)

    for (let i = 0; i < players.length; i++) {
      const team = i < halfPoint ? "labo" : "oncopole"
      await supabase.from("players").update({ team }).eq("id", players[i].id)
    }
  }

  // Chat functionality
  static async getChatMessages(roomId: string): Promise<ChatMessage[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("chat_messages").select("*").eq("room_id", roomId).order("created_at")

    if (error) return []
    return data
  }

  static async sendChatMessage(
    roomId: string,
    playerId: string,
    playerName: string,
    playerColor: string,
    message: string,
  ): Promise<void> {
    const supabase = createClient()
    await supabase.from("chat_messages").insert({
      room_id: roomId,
      player_id: playerId,
      player_name: playerName,
      player_color: playerColor,
      message,
    })
  }

  // Get enigma progress
  static async getEnigmaProgress(roomId: string, enigmaNumber: number): Promise<EnigmaProgress | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("enigma_progress")
      .select("*")
      .eq("room_id", roomId)
      .eq("enigma_number", enigmaNumber)
      .single()

    if (error) return null
    return data
  }
}
