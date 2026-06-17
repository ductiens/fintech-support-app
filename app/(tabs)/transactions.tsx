import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserMe, useTransactions, TransactionResponseData } from '@/src/hooks/use-finance-api';

function formatVND(value: number) {
  if (value === undefined || value === null) return "0 đ";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} • ${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

function getFormattedGroupDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const today = new Date();
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      return "HÔM NAY";
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "KHÁC";
  }
}

function getTransactionDetails(txn: TransactionResponseData, currentUserId: string) {
  let typeLabel = "Giao dịch";
  let nameLabel = "";
  let amountPrefix = "";
  let isPositive = false;
  let iconName: "arrow-right" | "plus" | "receipt-text-outline" = "receipt-text-outline";

  if (txn.type === 'DEPOSIT') {
    typeLabel = "Nạp tiền";
    nameLabel = txn.description || "Nạp tiền vào ví";
    amountPrefix = "+";
    isPositive = true;
    iconName = "plus";
  } else if (txn.type === 'WITHDRAWAL') {
    typeLabel = "Rút tiền";
    nameLabel = txn.description || "Rút tiền khỏi ví";
    amountPrefix = "-";
    isPositive = false;
    iconName = "arrow-right";
  } else if (txn.type === 'TRANSFER') {
    if (txn.recipient_user_id === currentUserId) {
      typeLabel = "Nhận tiền";
      nameLabel = txn.description || `Từ Ví V-Smart Pay`;
      amountPrefix = "+";
      isPositive = true;
      iconName = "plus";
    } else {
      typeLabel = "Chuyển tiền";
      nameLabel = txn.description || `Đến người nhận (${txn.recipient_user_id})`;
      amountPrefix = "-";
      isPositive = false;
      iconName = "arrow-right";
    }
  }

  return { typeLabel, nameLabel, amountPrefix, isPositive, iconName };
}

export default function TransactionsScreen() {
  const { data: user } = useUserMe();
  const { data: txHistory, isLoading } = useTransactions(20, 0);

  const currentUserId = user?.user_id || "";
  const transactions = txHistory?.transactions || [];

  // Group transactions by date
  const groups: { [key: string]: TransactionResponseData[] } = {};
  transactions.forEach((txn) => {
    const key = getFormattedGroupDate(txn.created_at);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(txn);
  });

  const groupKeys = Object.keys(groups);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Lịch sử giao dịch</Text>
        <Feather name="filter" size={28} color="#080808" />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0B956F" style={{ marginTop: 40 }} />
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có giao dịch nào.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {groupKeys.map((groupDate) => (
            <View key={groupDate}>
              <Text style={groupDate === "HÔM NAY" ? styles.sectionDate : styles.dayTitle}>
                {groupDate}
              </Text>
              <View style={styles.listBlock}>
                {groups[groupDate].map((txn) => (
                  <TransactionRow txn={txn} currentUserId={currentUserId} key={txn.transaction_id} />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function classifyTransaction(item: { label: string; name: string; type: string; backendCategory?: string }) {
  if (item.backendCategory && item.backendCategory !== "Khác") {
    const cat = item.backendCategory;
    let emoji = "💡";
    if (cat === "Ăn uống") emoji = "🍔";
    else if (cat === "Di chuyển") emoji = "🚗";
    else if (cat === "Hóa đơn & Tiện ích") emoji = "🏠";
    else if (cat === "Mua sắm") emoji = "🛍️";
    else if (cat === "Giải trí") emoji = "🎬";
    else if (cat === "Sức khỏe") emoji = "⚕️";
    else if (cat === "Giáo dục") emoji = "📚";
    else if (cat === "Chuyển tiền cá nhân") emoji = "💸";
    return { emoji, text: cat };
  }

  const name = item.name.toLowerCase();
  const label = item.label.toLowerCase();

  if (item.type === "transfer-out" || item.type === "transfer-in" || label.includes("chuyển") || label.includes("nhận")) {
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

function TransactionRow({ txn, currentUserId }: { txn: TransactionResponseData; currentUserId: string }) {
  const { typeLabel, nameLabel, amountPrefix, isPositive, iconName } = getTransactionDetails(txn, currentUserId);
  const isFailed = txn.status === 'FAILED';

  const category = classifyTransaction({
    label: typeLabel,
    name: nameLabel,
    type: isPositive ? "transfer-in" : "transfer-out",
    backendCategory: txn.category || undefined,
  });

  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        {iconName === "arrow-right" ? (
          <Feather name="arrow-right" size={25} color="#050505" />
        ) : iconName === "plus" ? (
          <Feather name="plus" size={29} color="#050505" />
        ) : (
          <MaterialCommunityIcons name="receipt-text-outline" size={25} color="#050505" />
        )}
      </View>

      <View style={styles.rowCenter}>
        <Text style={styles.rowLabel}>{typeLabel}</Text>
        <Text style={styles.rowName}>{nameLabel}</Text>
        <Text style={styles.rowDate}>{formatDate(txn.created_at)}</Text>
        <Text style={styles.categoryText}>{category.emoji} {category.text}</Text>
      </View>

      <View style={styles.amountWrap}>
        <Text style={[styles.amount, isPositive && styles.positiveAmount]}>
          {amountPrefix}{formatVND(txn.amount)}
        </Text>
        {isFailed ? <Text style={styles.failedText}>Thất bại</Text> : null}
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
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: 15,
    fontWeight: '500',
  },
});
