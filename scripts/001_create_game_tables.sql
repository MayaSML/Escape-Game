-- Create game_rooms table
create table if not exists public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host_id uuid references auth.users(id) on delete cascade,
  status text not null default 'waiting', -- waiting, playing, completed
  current_enigma integer not null default 0,
  max_players integer not null default 4,
  created_at timestamptz default now()
);

alter table public.game_rooms enable row level security;

-- Everyone can view rooms to join them
create policy "game_rooms_select_all"
  on public.game_rooms for select
  using (true);

-- Anyone can create a room
create policy "game_rooms_insert_all"
  on public.game_rooms for insert
  with check (true);

-- Only host can update room
create policy "game_rooms_update_host"
  on public.game_rooms for update
  using (host_id = auth.uid() or host_id is null);

-- Only host can delete room
create policy "game_rooms_delete_host"
  on public.game_rooms for delete
  using (host_id = auth.uid() or host_id is null);

-- Create players table
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.game_rooms(id) on delete cascade not null,
  name text not null,
  color text not null,
  avatar text not null,
  is_host boolean default false,
  team text, -- 'labo' or 'oncopole' for enigma 2
  joined_at timestamptz default now()
);

alter table public.players enable row level security;

-- Everyone can view players in any room
create policy "players_select_all"
  on public.players for select
  using (true);

-- Anyone can insert themselves as a player
create policy "players_insert_all"
  on public.players for insert
  with check (true);

-- Players can update their own data
create policy "players_update_own"
  on public.players for update
  using (true);

-- Players can delete themselves
create policy "players_delete_own"
  on public.players for delete
  using (true);

-- Create chat_messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.game_rooms(id) on delete cascade not null,
  player_id uuid references public.players(id) on delete cascade not null,
  player_name text not null,
  player_color text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

-- Everyone can view messages in any room
create policy "chat_messages_select_all"
  on public.chat_messages for select
  using (true);

-- Anyone can insert messages
create policy "chat_messages_insert_all"
  on public.chat_messages for insert
  with check (true);

-- Create enigma_progress table
create table if not exists public.enigma_progress (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.game_rooms(id) on delete cascade not null,
  enigma_number integer not null,
  started_at timestamptz default now(),
  completed_at timestamptz,
  time_spent integer, -- in seconds
  unique(room_id, enigma_number)
);

alter table public.enigma_progress enable row level security;

-- Everyone can view progress
create policy "enigma_progress_select_all"
  on public.enigma_progress for select
  using (true);

-- Anyone can insert/update progress
create policy "enigma_progress_insert_all"
  on public.enigma_progress for insert
  with check (true);

create policy "enigma_progress_update_all"
  on public.enigma_progress for update
  using (true);

-- Create indexes for better performance
create index if not exists idx_players_room_id on public.players(room_id);
create index if not exists idx_chat_messages_room_id on public.chat_messages(room_id);
create index if not exists idx_enigma_progress_room_id on public.enigma_progress(room_id);
create index if not exists idx_game_rooms_code on public.game_rooms(code);
