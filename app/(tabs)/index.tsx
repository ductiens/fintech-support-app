import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#041712', '#062C20', '#083E2D']} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.topRow}>
            <Text style={styles.greeting}>Xin chào Việt</Text>
            <View style={styles.notification}>
              <Feather name="bell" size={20} color="#FFFFFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </View>

          <View style={styles.logoRow}>
            <View style={styles.logoMark} />
            <Text style={styles.logoText}>V-Smart Pay</Text>
          </View>

          <View style={styles.balanceCard}>
            <View>
              <Text style={styles.balanceLabel}>Tài khoản của bạn</Text>
              <Text style={styles.balanceValue}>120.000.000 đ</Text>
            </View>
            <View style={styles.walletIcon}>
              <Feather name="credit-card" size={27} color="#0EE1A9" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Feather name="credit-card" size={24} color="#00D99F" />
            </View>
            <Text style={styles.actionText}>Nạp / Rút</Text>
          </View>
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Feather name="download" size={24} color="#00D99F" />
            </View>
            <Text style={styles.actionText}>Nhận tiền</Text>
          </View>
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="receipt-text-outline" size={26} color="#00D99F" />
            </View>
            <Text style={styles.actionText}>Thanh toán</Text>
          </View>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoTextWrap}>
            <Text style={styles.promoTitle}>Thanh toán hoá đơn tiện lợi</Text>
            <Text style={styles.promoText}>Điện, nước, internet, điện thoại tiện lợi cùng V-Smart Pay!</Text>
            <View style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Khám phá ngay</Text>
            </View>
          </View>
          <View style={styles.promoIllustration}>
            <Ionicons name="card-outline" size={45} color="#B8C4CD" />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </View>

        <TransactionPreview />
      </View>
    </View>
  );
}

function TransactionPreview() {
  return (
    <View style={styles.previewRow}>
      <View style={styles.previewIcon}>
        <Feather name="arrow-right" size={22} color="#070707" />
      </View>
      <View style={styles.previewCenter}>
        <Text style={styles.previewType}>Chuyển tiền</Text>
        <Text style={styles.previewName}>đến Trần Thị Mai Trang</Text>
        <Text style={styles.previewDate}>11:15 • 10/11/2025</Text>
      </View>
      <Text style={styles.previewAmount}>-1.850.000 đ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    height: 310,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  topRow: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    color: '#DCE7E4',
    fontSize: 14,
    fontWeight: '500',
  },
  notification: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#EF3340',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  logoRow: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 25,
    height: 14,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ skewX: '-16deg' }],
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  balanceCard: {
    marginTop: 34,
    padding: 22,
    height: 118,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  balanceLabel: {
    color: '#C8D6D2',
    fontSize: 15,
  },
  balanceValue: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  walletIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  content: {
    flex: 1,
    marginTop: -42,
    paddingHorizontal: 22,
    paddingBottom: 110,
  },
  actionRow: {
    height: 86,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#07100E',
  },
  actionIcon: {
    marginBottom: 7,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  promoCard: {
    marginTop: 20,
    minHeight: 132,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C4F3E4',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  promoTextWrap: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202020',
  },
  promoText: {
    marginTop: 6,
    maxWidth: 225,
    color: '#656565',
    fontSize: 14,
    lineHeight: 20,
  },
  promoButton: {
    marginTop: 13,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: '#060606',
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  promoIllustration: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F1F5F7',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    color: '#101010',
    fontWeight: '800',
  },
  seeAll: {
    color: '#0B956F',
    fontSize: 14,
    fontWeight: '700',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  previewIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
  },
  previewCenter: {
    flex: 1,
    marginLeft: 14,
  },
  previewType: {
    color: '#8A8A8A',
    fontSize: 13,
    fontWeight: '600',
  },
  previewName: {
    marginTop: 2,
    color: '#131313',
    fontSize: 15,
    fontWeight: '700',
  },
  previewDate: {
    marginTop: 3,
    color: '#333333',
    fontSize: 12,
  },
  previewAmount: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
  },
});
