import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const contacts = [
  { name: 'NGUYEN VAN A', detail: '1904 8223 1220 16 - TECHCOMBANK', logo: 'bank', color: '#DADADA' },
  { name: 'MAI DUC DUY', detail: '0448 0048 - ACB', logo: 'ACB', color: '#1D56AE' },
  { name: 'PHAM VAN DAT', detail: '1901 8313 6410 17 - TECHCOMBANK', logo: 'diamond', color: '#F11F2C' },
  { name: 'NGUYEN THI THU HA', detail: '1212 7512 32 - VIETCOMBANK', logo: 'triangle-down', color: '#11924A' },
  { name: 'NGUYEN VAN NAM', detail: '0901232512 - TPBANK', logo: 'triangle', color: '#F39B17' },
  { name: 'NGUYEN VAN NGUYEN', detail: '1901 8313 6410 17 - TECHCOMBANK', logo: 'diamond', color: '#F11F2C' },
];

export default function TransferScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Bạn muốn chuyển tiền đến</Text>

        <View style={styles.optionRow}>
          <View style={styles.transferOption}>
            <Feather name="credit-card" size={31} color="#2C2C2C" />
            <Text style={styles.optionText}>Ví V-Smart Pay</Text>
          </View>
          <View style={styles.transferOption}>
            <MaterialCommunityIcons name="bank" size={30} color="#2C2C2C" />
            <Text style={styles.optionText}>Ngân hàng</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Feather name="search" size={30} color="#050505" />
          <TextInput placeholder="Tìm kiếm" placeholderTextColor="#707070" style={styles.searchInput} />
        </View>

        <View style={styles.tabRow}>
          <View>
            <Text style={styles.activeTab}>Giao dịch gần đây</Text>
            <View style={styles.tabLine} />
          </View>
          <Text style={styles.inactiveTab}>Người nhận đã lưu</Text>
        </View>

        <View style={styles.list}>
          {contacts.map((item) => (
            <ContactRow key={`${item.name}-${item.detail}`} item={item} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

type Contact = (typeof contacts)[number];

function ContactRow({ item }: { item: Contact }) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.logoCircle}>
        {item.logo === 'ACB' ? (
          <Text style={[styles.logoText, { color: item.color }]}>{item.logo}</Text>
        ) : item.logo === 'bank' ? (
          <MaterialCommunityIcons name="bank" size={25} color="#C9C9C9" />
        ) : item.logo === 'diamond' ? (
          <View style={styles.diamondWrap}>
            <View style={[styles.diamond, { backgroundColor: item.color }]} />
            <View style={[styles.diamond, { backgroundColor: item.color }]} />
          </View>
        ) : item.logo === 'triangle-down' ? (
          <View style={[styles.triangleDown, { borderTopColor: item.color }]} />
        ) : (
          <View style={[styles.triangle, { borderBottomColor: item.color }]} />
        )}
      </View>
      <View style={styles.contactTextWrap}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactDetail}>{item.detail}</Text>
      </View>
    </View>
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
    paddingTop: 42,
    paddingBottom: 110,
  },
  title: {
    color: '#080808',
    fontSize: 25,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  optionRow: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 16,
  },
  transferOption: {
    flex: 1,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    gap: 13,
  },
  optionText: {
    color: '#1C1C1C',
    fontSize: 15,
    fontWeight: '500',
  },
  searchBox: {
    marginTop: 24,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 29,
    paddingHorizontal: 18,
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#222222',
  },
  tabRow: {
    marginTop: 24,
    height: 42,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 34,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  activeTab: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '800',
  },
  inactiveTab: {
    color: '#777777',
    fontSize: 16,
    fontWeight: '700',
  },
  tabLine: {
    marginTop: 15,
    height: 2,
    width: 144,
    backgroundColor: '#000000',
  },
  list: {
    marginTop: 22,
    gap: 22,
  },
  contactRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: '#F3F3F3',
    overflow: 'hidden',
  },
  logoText: {
    fontSize: 19,
    fontWeight: '900',
  },
  diamondWrap: {
    flexDirection: 'row',
    gap: 3,
  },
  diamond: {
    width: 16,
    height: 16,
    transform: [{ rotate: '45deg' }],
  },
  triangleDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderTopWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '75deg' }],
  },
  contactTextWrap: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  contactName: {
    color: '#191919',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  contactDetail: {
    marginTop: 6,
    color: '#6B6B6B',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
