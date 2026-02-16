/**
 * Supabase client for media-flatoutmotorcycles.
 * Shares next_universal_unit_inventory with fullcalendar-service-scheduler.
 */

// Get Supabase from global (loaded via CDN in index.html)
const { createClient } = window.supabase || {};

const url = import.meta.env?.VITE_SUPABASE_URL;
const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;

/** Supabase client, or null if env not configured. */
export const supabase = url && key && createClient ? createClient(url, key) : null;

/** Whether Supabase is configured and available. */
export const isSupabaseConfigured = () => !!supabase;
