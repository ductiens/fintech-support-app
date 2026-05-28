import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/src/components/app-button';
import { Screen } from '@/src/components/screen';
import { useAuth } from '@/src/providers/auth-provider';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Login failed', 'Please check your email and password.');
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Base React Native app with auth, API client, and reusable UI.</Text>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <AppButton title="Sign in" onPress={handleLogin} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#667085',
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
});
