import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TransactionItem = {
  type: 'transfer-out' | 'transfer-in' | 'payment';
  label: string;
  name: string;
  date: string;
  amount: string;
  positive?: boolean;
  failed?: boolean;
};

const todayItems: TransactionItem[] = [
  {
    type: 'transfer-out',
    label: 'Chuyển tiền',
    name: 'đến Trần Thị Mai Trang',
    date: '11:15 • 10/11/2025',
    amount: '-1.850.000 đ',
  },
  {
    type: 'transfer-in',
    label: 'Nhận tiền',
    name: 'từ Trần Thị Mai Trang',
    date: '11:15 • 10/11/2025',
    amount: '+1.850.000 đ',
    positive: true,
  },
  {
    type: 'transfer-in',
    label: 'Nhận tiền',
    name: 'từ Trần Thị Mai Trang',
    date: '11:15 • 10/11/2025',
    amount: '+1.850.000 đ',
    positive: true,
  },
  {
    type: 'payment',
    label: 'Thanh toán',
    name: 'hóa đơn XanhSM',
    date: '11:15 • 10/11/2025',
    amount: '-150.000 đ',
  },
  {
    type: 'payment',
    label: 'Thanh toán',
    name: 'hóa đơn Pizza',
    date: '11:15 • 10/11/2025',
    amount: '-150.000 đ',
    failed: true,
  },
];

const previousItems: TransactionItem[] = [
  {
    type: 'transfer-out',
    label: 'Chuyển tiền',
    name: 'đến Trần Thị Mai Trang',
    date: '11:15 • 09/11/2025',
    amount: '-1.850.000 đ',
  },
];

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Lịch sử giao dịch</Text>
        <Feather name="filter" size={28} color="#080808" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionDate}>HÔM NAY</Text>
        <View style={styles.listBlock}>
          {todayItems.map((item, index) => (
            <TransactionRow item={item} key={`${item.name}-${index}`} />
          ))}
        </View>

        <Text style={styles.dayTitle}>09/11/2025</Text>
        <View style={styles.listBlock}>
          {previousItems.map((item, index) => (
            <TransactionRow item={item} key={`${item.name}-previous-${index}`} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionRow({ item }: { item: TransactionItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        {item.type === 'transfer-out' ? (
          <Feather name="arrow-right" size={25} color="#050505" />
        ) : item.type === 'transfer-in' ? (
          <Feather name="plus" size={29} color="#050505" />
        ) : (
          <MaterialCommunityIcons name="receipt-text-outline" size={25} color="#050505" />
        )}
      </View>

      <View style={styles.rowCenter}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowName}>{item.name}</Text>
        <Text style={styles.rowDate}>{item.date}</Text>
      </View>

      <View style={styles.amountWrap}>
        <Text style={[styles.amount, item.positive && styles.positiveAmount]}>{item.amount}</Text>
        {item.failed ? <Text style={styles.failedText}>Thất bại</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 22,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#0D0D0D',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 124,
  },
  sectionDate: {
    marginTop: 8,
    marginBottom: 24,
    color: '#444444',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  dayTitle: {
    marginTop: 34,
    marginBottom: 24,
    color: '#202020',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  listBlock: {
    gap: 24,
  },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: '#F4F4F4',
  },
  rowCenter: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center',
  },
  rowLabel: {
    color: '#8A8A8A',
    fontSize: 14,
    fontWeight: '600',
  },
  rowName: {
    marginTop: 3,
    color: '#101010',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  rowDate: {
    marginTop: 4,
    color: '#141414',
    fontSize: 13,
    fontWeight: '500',
  },
  amountWrap: {
    minWidth: 118,
    alignItems: 'flex-end',
  },
  amount: {
    color: '#101010',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.1,
  },
  positiveAmount: {
    color: '#1FA56F',
  },
  failedText: {
    marginTop: 5,
    color: '#E05A4F',
    fontSize: 14,
    fontWeight: '700',
  },
});
