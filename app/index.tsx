import { Redirect } from 'expo-router';

import { useAuth } from '@/src/providers/auth-provider';

export default function IndexScreen() {
  const { isAuthenticated } = useAuth();

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
