import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third argument '' loads all env vars, regardless of prefix.
  // We cast process to any to avoid TS errors in some environments
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    // CRITICAL: Set base to './' so assets are loaded relatively.
    // This fixes "White Screen" on deployments where the app isn't at the domain root.
    base: './',
    plugins: [react()],
    define: {
      // Expose these specific variables to the client
      // Vite replaces occurrences of these strings with their values
      // Use || '' to ensure they are replaced with empty strings if undefined, preventing "process is not defined"
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || ''),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || ''),
    },
    build: {
      outDir: 'dist',
      sourcemap: true, // Enable source maps for debugging production errors
    }
  };
});