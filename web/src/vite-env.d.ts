/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_CF_WS_URL: string;
  readonly VITE_CF_CHAT_URL: string;
}
