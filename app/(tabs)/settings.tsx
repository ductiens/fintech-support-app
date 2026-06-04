import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAuth } from '@/src/providers/auth-provider';
import { useUserMe } from '@/src/hooks/use-finance-api';

const menuItems = ['Bảo mật tài khoản', 'Liên kết ngân hàng', 'Hỗ trợ khách hàng'];

export default function AccountScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data: user, isLoading } = useUserMe();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Tài khoản</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#062C20" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Feather name="user" size={34} color="#050505" />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.name}>{user?.full_name}</Text>
              <Text style={styles.subtitle}>SĐT: {user?.phone}</Text>
              <Text style={styles.subtext}>Email: {user?.email || 'Chưa thiết lập'}</Text>
              
              <View style={[
                styles.kycBadge, 
                user?.kyc_status === 'VERIFIED' ? styles.kycVerified : styles.kycUnverified
              ]}>
                <Text style={[
                  styles.kycText,
                  user?.kyc_status === 'VERIFIED' ? styles.kycTextVerified : styles.kycTextUnverified
                ]}>
                  {user?.kyc_status === 'VERIFIED' ? '✓ Đã xác minh (KYC)' : '✗ Chưa xác minh KYC'}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View style={[styles.menuRow, index !== menuItems.length - 1 && styles.menuBorder]} key={item}>
              <Text style={styles.menuText}>{item}</Text>
              <Feather name="chevron-right" size={22} color="#A0A0A0" />
            </View>
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 110,
  },
  title: {
    color: '#0D0D0D',
    fontSize: 28,
    fontWeight: '900',
  },
  profileCard: {
    marginTop: 28,
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#F6F6F6',
  },
  avatar: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
  },
  profileText: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    color: '#111111',
    fontSize: 19,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 5,
    color: '#6F6F6F',
    fontSize: 14,
    fontWeight: '500',
  },
  subtext: {
    marginTop: 2,
    color: '#8A8A8A',
    fontSize: 12,
    fontWeight: '500',
  },
  kycBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  kycVerified: {
    backgroundColor: '#E8F5E9',
  },
  kycUnverified: {
    backgroundColor: '#FFEBEE',
  },
  kycText: {
    fontSize: 11,
    fontWeight: '700',
  },
  kycTextVerified: {
    color: '#2E7D32',
  },
  kycTextUnverified: {
    color: '#C62828',
  },
  menuCard: {
    marginTop: 22,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    overflow: 'hidden',
  },
  menuRow: {
    height: 62,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  menuText: {
    color: '#161616',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 34,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFEBEA',
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '700',
  },
});
