import { createClient } from './client'

export function subscribeToNotifications(
  userId: string,
  onNew: (payload: Record<string, unknown>) => void
) {
  const supabase = createClient()
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, onNew)
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}

export function subscribeToCheckins(onNew: (payload: Record<string, unknown>) => void) {
  const supabase = createClient()
  const channel = supabase
    .channel('checkins-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'checkins' }, onNew)
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
