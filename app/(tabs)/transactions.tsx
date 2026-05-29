import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TransactionItem = {
  type: "transfer-out" | "transfer-in" | "payment";
  label: string;
  name: string;
  date: string;
  amount: string;
  positive?: boolean;
  failed?: boolean;
};

const todayItems: TransactionItem[] = [
  {
    type: "transfer-out",
    label: "Chuyển tiền",
    name: "đến Trần Thị Mai Trang",
    date: "11:15 • 10/11/2025",
    amount: "-1.850.000 đ",
  },
  {
    type: "transfer-in",
    label: "Nhận tiền",
    name: "từ Trần Thị Mai Trang",
    date: "11:15 • 10/11/2025",
    amount: "+1.850.000 đ",
    positive: true,
  },
  {
    type: "transfer-in",
    label: "Nhận tiền",
    name: "từ Trần Thị Mai Trang",
    date: "11:15 • 10/11/2025",
    amount: "+1.850.000 đ",
    positive: true,
  },
  {
    type: "payment",
    label: "Thanh toán",
    name: "hóa đơn XanhSM",
    date: "11:15 • 10/11/2025",
    amount: "-150.000 đ",
  },
  {
    type: "payment",
    label: "Thanh toán",
    name: "hóa đơn Pizza",
    date: "11:15 • 10/11/2025",
    amount: "-150.000 đ",
    failed: true,
  },
];

const previousItems: TransactionItem[] = [
  {
    type: "transfer-out",
    label: "Chuyển tiền",
    name: "đến Trần Thị Mai Trang",
    date: "11:15 • 09/11/2025",
    amount: "-1.850.000 đ",
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

function classifyTransaction(item: TransactionItem) {
  const name = item.name.toLowerCase();
  const label = item.label.toLowerCase();

  if (item.type === "transfer-out" || item.type === "transfer-in" || label.includes("chuyển")) {
    return { emoji: "💸", text: "Chuyển tiền cá nhân" };
  }

  if (label.includes("thanh toán") || label.includes("payment")) {
    if (name.includes("pizza") || name.includes("ăn") || name.includes("quán") || name.includes("cafe") || name.includes("coffee")) {
      return { emoji: "🍔", text: "Ăn uống" };
    }
    if (name.includes("hóa đơn") || name.includes("hoá đơn") || name.includes("điện") || name.includes("nước") || name.includes("internet") || name.includes("xanh")) {
      return { emoji: "🏠", text: "Hóa đơn & Tiện ích" };
    }
    return { emoji: "🏠", text: "Hóa đơn & Tiện ích" };
  }

  return { emoji: "❓", text: "Chưa phân loại" };
}

function TransactionRow({ item }: { item: TransactionItem }) {
  const category = classifyTransaction(item);

  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        {item.type === "transfer-out" ? (
          <Feather name="arrow-right" size={25} color="#050505" />
        ) : item.type === "transfer-in" ? (
          <Feather name="plus" size={29} color="#050505" />
        ) : (
          <MaterialCommunityIcons name="receipt-text-outline" size={25} color="#050505" />
        )}
      </View>

      <View style={styles.rowCenter}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowName}>{item.name}</Text>
        <Text style={styles.rowDate}>{item.date}</Text>
        <Text style={styles.categoryText}>{category.emoji} {category.text}</Text>
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
    backgroundColor: "#FAFBFC",
  },
  header: {
    paddingTop: 44,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#0B0B0B",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  sectionDate: {
    marginTop: 6,
    marginBottom: 12,
    color: "#7A7A7A",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  dayTitle: {
    marginTop: 28,
    marginBottom: 12,
    color: "#202020",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  listBlock: {
    gap: 12,
  },
  row: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F6",
  },
  iconCircle: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEFF1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  rowCenter: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  rowLabel: {
    color: "#8B8B8B",
    fontSize: 13,
    fontWeight: "600",
  },
  rowName: {
    marginTop: 2,
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  rowDate: {
    marginTop: 4,
    color: "#9A9A9A",
    fontSize: 12,
    fontWeight: "500",
  },
  categoryText: {
    marginTop: 4,
    color: "#6B6B6B",
    fontSize: 12,
    fontWeight: "600",
  },
  amountWrap: {
    minWidth: 110,
    alignItems: "flex-end",
  },
  amount: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  positiveAmount: {
    color: "#1FA56F",
  },
  failedText: {
    marginTop: 6,
    color: "#E05A4F",
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "rgba(224,90,79,0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
