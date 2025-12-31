import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbNote {
  id: number;
  user_id: string;
  content: string;
  status: 'none' | 'todo' | 'in_progress' | 'done';
  created_at: string;
  updated_at: string;
}

export interface DbTag {
  id: number;
  user_id: string;
  name: string;
  color: string;
}

export interface DbNoteTag {
  note_id: number;
  tag_id: number;
}
