import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_PUBLIC_APP_ID,
  import.meta.env.VITE_PUBLIC_ANON_KEY
);