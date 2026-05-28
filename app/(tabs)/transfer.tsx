import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const contacts = [
  { name: "NGUYEN VAN A", detail: "1904 8223 1220 16 - TECHCOMBANK", logo: "bank", color: "#DADADA" },
  { name: "MAI DUC DUY", detail: "0448 0048 - ACB", logo: "ACB", color: "#1D56AE" },
  { name: "PHAM VAN DAT", detail: "1901 8313 6410 17 - TECHCOMBANK", logo: "diamond", color: "#F11F2C" },
  { name: "NGUYEN THI THU HA", detail: "1212 7512 32 - VIETCOMBANK", logo: "triangle-down", color: "#11924A" },
  { name: "NGUYEN VAN NAM", detail: "0901232512 - TPBANK", logo: "triangle", color: "#F39B17" },
  { name: "NGUYEN VAN NGUYEN", detail: "1901 8313 6410 17 - TECHCOMBANK", logo: "diamond", color: "#F11F2C" },
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
        {item.logo === "ACB" ? (
          <Text style={[styles.logoText, { color: item.color }]}>{item.logo}</Text>
        ) : item.logo === "bank" ? (
          <MaterialCommunityIcons name="bank" size={25} color="#C9C9C9" />
        ) : item.logo === "diamond" ? (
          <View style={styles.diamondWrap}>
            <View style={[styles.diamond, { backgroundColor: item.color }]} />
            <View style={[styles.diamond, { backgroundColor: item.color }]} />
          </View>
        ) : item.logo === "triangle-down" ? (
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
    backgroundColor: "#FAFBFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 90,
  },
  title: {
    color: "#0B0B0B",
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  optionRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 14,
  },
  transferOption: {
    flex: 1,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EFF1F3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 4,
    gap: 10,
  },
  optionText: {
    color: "#1C1C1C",
    fontSize: 14,
    fontWeight: "600",
  },
  searchBox: {
    marginTop: 20,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F2F4",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#222222",
  },
  tabRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },
  activeTab: {
    color: "#0B0B0B",
    fontSize: 15,
    fontWeight: "800",
  },
  inactiveTab: {
    color: "#8A8A8A",
    fontSize: 15,
    fontWeight: "600",
  },
  tabLine: {
    marginTop: 12,
    height: 3,
    width: 72,
    backgroundColor: "#062C20",
    borderRadius: 3,
  },
  list: {
    marginTop: 18,
    gap: 18,
  },
  contactRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F6F7",
  },
  logoCircle: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: "#F6F7F8",
    overflow: "hidden",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "900",
  },
  diamondWrap: {
    flexDirection: "row",
    gap: 6,
  },
  diamond: {
    width: 14,
    height: 14,
    transform: [{ rotate: "45deg" }],
  },
  triangleDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 22,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 23,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    transform: [{ rotate: "75deg" }],
  },
  contactTextWrap: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  contactName: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  contactDetail: {
    marginTop: 4,
    color: "#6B6B6B",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
