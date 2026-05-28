import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/src/components/app-button';
import { Screen } from '@/src/components/screen';
import { appConfig } from '@/src/config/app-config';
import { useAuth } from '@/src/providers/auth-provider';

export default function SettingsScreen() {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.description}>Common app settings and environment information.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Current user</Text>
        <Text style={styles.value}>{user?.email ?? 'Not signed in'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>API base URL</Text>
        <Text style={styles.value}>{appConfig.apiBaseUrl}</Text>
      </View>

      <AppButton title="Sign out" variant="secondary" onPress={handleSignOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  description: {
    color: '#667085',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#EAECF0',
    borderRadius: 16,
    gap: 4,
    marginBottom: 12,
    padding: 16,
  },
  label: {
    color: '#667085',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '600',
  },
});
