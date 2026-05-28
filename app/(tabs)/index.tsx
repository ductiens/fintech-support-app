import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/src/components/app-button';
import { Screen } from '@/src/components/screen';
import { useAuth } from '@/src/providers/auth-provider';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>React Native Base</Text>
        <Text style={styles.title}>Hello, {user?.name ?? 'Developer'} 👋</Text>
        <Text style={styles.description}>
          This screen is ready for dashboard content, API data, and project-specific modules.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What is included?</Text>
        <Text style={styles.cardText}>• Expo Router navigation</Text>
        <Text style={styles.cardText}>• Auth provider pattern</Text>
        <Text style={styles.cardText}>• API client wrapper</Text>
        <Text style={styles.cardText}>• Reusable Screen and Button components</Text>
      </View>

      <AppButton title="Primary action" onPress={() => {}} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 24,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
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
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    gap: 8,
    marginBottom: 24,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardText: {
    color: '#475467',
    fontSize: 15,
  },
});
