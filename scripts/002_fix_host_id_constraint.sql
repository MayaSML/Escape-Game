-- Remove the foreign key constraint on host_id that references auth.users
-- This allows anonymous players to create rooms without authentication

-- Drop the existing foreign key constraint
alter table public.game_rooms 
  drop constraint if exists game_rooms_host_id_fkey;

-- Make host_id reference the players table instead
-- This way the host is just the first player who created the room
alter table public.game_rooms
  add constraint game_rooms_host_id_fkey 
  foreign key (host_id) 
  references public.players(id) 
  on delete set null;

-- Update the policies to work without auth.uid()
drop policy if exists "game_rooms_update_host" on public.game_rooms;
drop policy if exists "game_rooms_delete_host" on public.game_rooms;

-- Anyone can update rooms (we'll handle permissions in the app)
create policy "game_rooms_update_all"
  on public.game_rooms for update
  using (true);

-- Anyone can delete rooms (we'll handle permissions in the app)
create policy "game_rooms_delete_all"
  on public.game_rooms for delete
  using (true);
