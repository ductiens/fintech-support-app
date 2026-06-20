import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Sign in', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Sign up', headerShown: false }} />
    </Stack>
  );
}
