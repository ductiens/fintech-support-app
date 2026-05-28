import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const menuItems = ['Thông tin cá nhân', 'Bảo mật tài khoản', 'Liên kết ngân hàng', 'Hỗ trợ khách hàng'];

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Tài khoản</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Feather name="user" size={34} color="#050505" />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>NGUYEN VAN A</Text>
            <Text style={styles.subtitle}>Tài khoản V-Smart Pay</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#999999" />
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View style={[styles.menuRow, index !== menuItems.length - 1 && styles.menuBorder]} key={item}>
              <Text style={styles.menuText}>{item}</Text>
              <Feather name="chevron-right" size={22} color="#A0A0A0" />
            </View>
          ))}
        </View>
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
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 18,
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
});
