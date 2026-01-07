import { createClient } from '@supabase/supabase-js';

// DIRECTLY access the variables so Vite's `define` plugin can replace the full string `process.env.SUPABASE_URL`.
// Do NOT wrap in `if (process)` checks.

// @ts-ignore
const envUrl = process.env.SUPABASE_URL;
// @ts-ignore
const envKey = process.env.SUPABASE_ANON_KEY;

// Credentials derived from your prompt
// Project ID: rnzbverahetjlmngzckn (from db.rnzbverahetjlmngzckn.supabase.co)
const FALLBACK_URL = 'https://rnzbverahetjlmngzckn.supabase.co';
const FALLBACK_KEY = 'sb_publishable_dh6FcLmxe4x-gqEYwd5OlA_eDgQEHmc';

// Fallback logic: Env Var -> Provided Hardcoded -> Placeholder
const supabaseUrl = (envUrl && typeof envUrl === 'string' && envUrl.startsWith('http'))
  ? envUrl
  : FALLBACK_URL;

const supabaseAnonKey = (envKey && typeof envKey === 'string' && envKey.length > 0)
  ? envKey
  : FALLBACK_KEY;

if (!supabaseUrl || supabaseUrl === 'https://placeholder-project.supabase.co') {
  console.warn('⚠️ Supabase credentials missing. Authentication will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);