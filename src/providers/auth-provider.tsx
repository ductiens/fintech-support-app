import { createContext, PropsWithChildren, useContext, useMemo, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { appConfig } from '@/src/config/app-config';

const setStorageItemAsync = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteStorageItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export type User = {
  user_id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  role: string;
  kyc_status: string;
  created_at: string;
};

type SignInInput = {
  phone: string;
  password: string;
};

type SignUpInput = {
  full_name: string;
  phone: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load and validate token on mount
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await getStorageItemAsync('accessToken');
        const storedUserJson = await getStorageItemAsync('user');

        if (storedToken && storedUserJson) {
          // Validate the token by fetching profile
          const response = await fetch(`${appConfig.apiBaseUrl}/api/v1/users/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const json = await response.ok ? await response.json() : null;
            if (json && json.success && json.data) {
              setAccessToken(storedToken);
              setUser(json.data);
            } else {
              // Token invalid, clear store
              await deleteStorageItemAsync('accessToken');
              await deleteStorageItemAsync('user');
            }
          } else {
            // Non-2xx response from backend (e.g. 401 Unauthorized), clear token
            await deleteStorageItemAsync('accessToken');
            await deleteStorageItemAsync('user');
          }
        }
      } catch (error) {
        console.error('Failed to load or validate stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      signIn: async ({ phone, password }: SignInInput) => {
        try {
          const response = await fetch(`${appConfig.apiBaseUrl}/api/v1/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, password }),
          });

          const json = await response.json();

          if (!response.ok || !json.success) {
            throw new Error(json.message || 'Số điện thoại hoặc mật khẩu không chính xác.');
          }

          const { access_token, user: apiUser } = json.data;

          await setStorageItemAsync('accessToken', access_token);
          await setStorageItemAsync('user', JSON.stringify(apiUser));

          setAccessToken(access_token);
          setUser(apiUser);
        } catch (error) {
          throw error;
        }
      },
      signUp: async ({ full_name, phone, password }: SignUpInput) => {
        try {
          const response = await fetch(`${appConfig.apiBaseUrl}/api/v1/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ full_name, phone, password }),
          });

          const json = await response.json();

          if (!response.ok || !json.success) {
            throw new Error(json.message || 'Đăng ký thất bại. Số điện thoại có thể đã tồn tại.');
          }

          // Automatically log in after registration
          const loginResponse = await fetch(`${appConfig.apiBaseUrl}/api/v1/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, password }),
          });

          const loginJson = await loginResponse.json();

          if (!loginResponse.ok || !loginJson.success) {
            throw new Error(loginJson.message || 'Đăng ký thành công nhưng tự động đăng nhập thất bại.');
          }

          const { access_token, user: apiUser } = loginJson.data;

          await setStorageItemAsync('accessToken', access_token);
          await setStorageItemAsync('user', JSON.stringify(apiUser));

          setAccessToken(access_token);
          setUser(apiUser);
        } catch (error) {
          throw error;
        }
      },
      signOut: async () => {
        try {
          await deleteStorageItemAsync('accessToken');
          await deleteStorageItemAsync('user');
        } catch (error) {
          console.error('Failed to clear secure store on signout:', error);
        } finally {
          setUser(null);
          setAccessToken(null);
        }
      },
      updateUser: (updatedUser: User) => {
        setUser(updatedUser);
        setStorageItemAsync('user', JSON.stringify(updatedUser)).catch((err) => {
          console.error('Failed to update persisted user:', err);
        });
      },
    }),
    [accessToken, user, isLoading]
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
