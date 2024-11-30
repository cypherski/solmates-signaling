import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Create a new room or join an existing one
export async function createOrJoinRoom() {
  try {
    const sessionId = crypto.randomUUID();
    
    // First try to join an existing waiting room
    const { data: existingRoom, error: findError } = await supabase
      .from('video_rooms')
      .select()
      .eq('status', 'waiting')
      .neq('session_id', sessionId)
      .is('connected_by', null)
      .limit(1)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }

    if (existingRoom) {
      // Join existing room
      const { data: updatedRoom, error: updateError } = await supabase
        .from('video_rooms')
        .update({
          status: 'connected',
          connected_by: sessionId,
          connected_at: new Date().toISOString()
        })
        .eq('id', existingRoom.id)
        .eq('status', 'waiting')
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedRoom;
    }

    // Create new room
    const { data: newRoom, error: insertError } = await supabase
      .from('video_rooms')
      .insert([{
        status: 'waiting',
        session_id: sessionId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return newRoom;

  } catch (error) {
    console.error('Error in createOrJoinRoom:', error);
    throw error;
  }
}

// Subscribe to room updates
export function subscribeToRoom(roomId: string, onSignal: (signal: any) => void) {
  const channel = supabase
    .channel(`room:${roomId}`)
    .on('broadcast', { event: 'signal' }, ({ payload }) => {
      if (payload.signal) {
        onSignal(payload.signal);
      }
    })
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}

// Send signal to room
export async function sendSignal(roomId: string, signal: any) {
  const { error } = await supabase
    .from('video_rooms')
    .update({
      signal,
      last_signal_at: new Date().toISOString()
    })
    .eq('id', roomId);

  if (error) throw error;
}

// End room session
export async function endRoom(roomId: string) {
  const { error } = await supabase
    .from('video_rooms')
    .update({
      status: 'ended',
      ended_at: new Date().toISOString()
    })
    .eq('id', roomId);

  if (error) throw error;
}