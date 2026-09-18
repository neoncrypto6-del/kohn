import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://plhfngvoizzyfaliqrnb.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY =
'sb_publishable_oFp3DaUI0-CZDwYEzNLn-g_04Flf753';

export const PACKAGE_IMAGE_BUCKET = 'package-images';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});