import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type SignInInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      signIn: async ({ email }: SignInInput) => {
        // TODO: Replace this mock with real API call.
        setUser({
          id: 'demo-user-id',
          name: 'Demo User',
          email,
        });
        setAccessToken('demo-access-token');
      },
      signOut: async () => {
        setUser(null);
        setAccessToken(null);
      },
    }),
    [accessToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
