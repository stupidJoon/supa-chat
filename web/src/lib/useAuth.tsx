import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  ip?: string;
};

const initialState: AuthContextType = {
  ip: undefined,
}

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ip, setIp] = useState<string | undefined>();

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((json) => setIp(json.ip));
  }, []);

  return <AuthContext.Provider value={{ ip }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
