import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/src/components/app-button';
import { Screen } from '@/src/components/screen';
import { useAuth } from '@/src/providers/auth-provider';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [phone, setPhone] = useState('0987654321');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ số điện thoại và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      await signIn({ phone, password });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Đăng nhập thất bại', error.message || 'Vui lòng kiểm tra lại số điện thoại và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Ứng dụng V-Smart Pay kết nối ví Fintech và Trợ lý ảo AI.</Text>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholder="Số điện thoại"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <AppButton title={loading ? "Đang xử lý..." : "Đăng nhập"} onPress={handleLogin} disabled={loading} />
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
