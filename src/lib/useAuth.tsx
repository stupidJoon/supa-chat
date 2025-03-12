import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase.ts';

type AuthContextType = {
  user: User | null | undefined;
  setUser: (user: User | null) => void;
};

const initialState: AuthContextType = {
  user: undefined,
  setUser: () => null,
}

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setUser(data.session?.user ?? null);
    })();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
