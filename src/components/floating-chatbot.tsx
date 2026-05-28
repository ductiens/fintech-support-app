import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory] = useState([
    { id: "1", title: "Phiên: 28/05/2026", preview: "Kiểm tra giao dịch chuyển tiền..." },
    { id: "2", title: "Phiên: 27/05/2026", preview: "Cách đổi mật khẩu" },
    { id: "3", title: "Phiên: 26/05/2026", preview: "Vấn đề thanh toán" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      {isOpen ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          pointerEvents="auto"
          style={styles.fullScreen}
        >
          <SafeAreaView style={styles.chatScreen}>
            <View style={styles.header}>
              <Pressable hitSlop={10} onPress={() => setIsOpen(false)} style={styles.backButton}>
                <Feather name="arrow-left" size={25} color="#111111" />
              </Pressable>

              <Text numberOfLines={1} style={styles.headerTitle}>
                Trợ thủ AI - VSmart
              </Text>

              {/* <View style={styles.headerActions}>
                <Pressable style={styles.circleButton}>
                  <Feather name="star" size={22} color="#171717" />
                </Pressable>
                <View style={styles.groupButton}>
                  <MaterialCommunityIcons name="truck-outline" size={23} color="#171717" />
                  <Feather name="home" size={23} color="#171717" />
                </View>
              </View> */}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              <Text style={styles.dateText}>28/05/2026, 16:31</Text>

              <View style={styles.userQuestionBubble}>
                <Text style={styles.userQuestionText}>
                  Tôi muốn kiểm tra giao dịch chuyển tiền gần đây. VSmart ghi rõ trạng thái và hướng dẫn xử lý nếu giao
                  dịch thất bại.
                </Text>
              </View>

              <View style={styles.answerBlock}>
                <Text style={styles.sectionTitle}>Kiểm tra giao dịch trên V-Smart Pay:</Text>

                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.paragraph}>
                    Vào mục <Text style={styles.boldText}>Giao dịch</Text> ở thanh điều hướng bên dưới để xem lịch sử
                    giao dịch.
                  </Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.paragraph}>
                    Giao dịch thành công sẽ hiển thị số tiền, người nhận và thời gian xử lý.
                  </Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.paragraph}>
                    Nếu giao dịch có trạng thái <Text style={styles.boldText}>Thất bại</Text>, số dư sẽ không bị trừ
                    hoặc sẽ được hoàn lại sau khi đối soát.
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>Khi giao dịch thất bại:</Text>

                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.paragraph}>Kiểm tra lại số dư ví và thông tin người nhận.</Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.paragraph}>Không thực hiện lại quá nhiều lần nếu hệ thống đang xử lý.</Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.paragraph}>
                    Liên hệ hỗ trợ nếu tiền đã bị trừ nhưng người nhận chưa nhận được.
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>Hướng dẫn nhanh:</Text>

                <View style={styles.numberRow}>
                  <Text style={styles.number}>1.</Text>
                  <Text style={styles.paragraph}>Mở tab Giao dịch.</Text>
                </View>
                <View style={styles.numberRow}>
                  <Text style={styles.number}>2.</Text>
                  <Text style={styles.paragraph}>Chọn giao dịch cần kiểm tra.</Text>
                </View>
                <View style={styles.numberRow}>
                  <Text style={styles.number}>3.</Text>
                  <Text style={styles.paragraph}>Gửi mã giao dịch cho bộ phận hỗ trợ nếu cần tra soát.</Text>
                </View>
              </View>
            </ScrollView>

              {showHistory ? (
                <Pressable style={styles.historyOverlay} onPress={() => setShowHistory(false)}>
                  <View style={styles.historyPanel} onStartShouldSetResponder={() => true}>
                    <Text style={styles.historyTitle}>Lịch sử chat</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:8}} contentContainerStyle={{paddingBottom:8}}>
                      {chatHistory.map((h) => (
                        <Pressable key={h.id} style={styles.historyItem} onPress={() => { /* load session preview */ }}>
                          <Text style={styles.historyItemTitle}>{h.title}</Text>
                          <Text style={styles.historyItemPreview}>{h.preview}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </Pressable>
              ) : null}

            <View style={styles.bottomBar}>
              <Pressable style={styles.menuButton} onPress={() => setShowHistory(true)}>
                <Feather name="menu" size={22} color="#222222" />
              </Pressable>

              <View style={styles.inputPill}>
                <Text style={styles.sparkle}>✦</Text>
                <TextInput
                  placeholder="Hỏi VSmart bất cứ điều gì..."
                  placeholderTextColor="#7C7C7C"
                  style={styles.input}
                  value={message}
                  onChangeText={setMessage}
                  onSubmitEditing={handleSend}
                />
                <Pressable onPress={handleSend} style={styles.sendButton}>
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      ) : null}

      {!isOpen ? (
        <Pressable onPress={() => { setIsOpen(true); setMessage(''); setShowHistory(false); }} style={styles.floatingButton}>
          <Ionicons name="chatbubble-ellipses" size={28} color="#FFFFFF" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 112,
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: "#062C20",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 18,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F7F8FA",
  },
  chatScreen: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    height: 76,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEFF1",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 14,
    color: "#25272A",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  circleButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEFF1",
  },
  groupButton: {
    height: 44,
    minWidth: 84,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEFF1",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 42,
    paddingBottom: 120,
  },
  dateText: {
    alignSelf: "center",
    marginBottom: 16,
    color: "#777C80",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  userQuestionBubble: {
    alignSelf: "flex-end",
    maxWidth: "86%",
    marginBottom: 30,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#0B8F6A",
  },
  userQuestionText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  answerBlock: {
    gap: 18,
  },
  sectionTitle: {
    marginTop: 2,
    color: "#050505",
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  bulletRow: {
    flexDirection: "row",
    paddingLeft: 18,
    gap: 14,
  },
  bullet: {
    color: "#050505",
    fontSize: 24,
    lineHeight: 35,
  },
  numberRow: {
    flexDirection: "row",
    paddingLeft: 20,
    gap: 18,
  },
  number: {
    color: "#050505",
    fontSize: 22,
    lineHeight: 34,
    fontWeight: "600",
  },
  paragraph: {
    flex: 1,
    color: "#111111",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  boldText: {
    fontWeight: "900",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 100,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(247,248,250,0.96)",
  },
  menuButton: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 10,
  },
  historyOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1100,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  historyPanel: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 100,
    maxHeight: 260,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F4',
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#050505',
  },
  historyItemPreview: {
    fontSize: 13,
    color: '#777C80',
    marginTop: 4,
  },

  inputPill: {
    flex: 1,
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 31,
    paddingLeft: 18,
    paddingRight: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 10,
  },
  sparkle: {
    color: "#0B8F6A",
    fontSize: 22,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 52,
    color: "#111111",
    fontSize: 18,
    fontWeight: "500",
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#062C20",
  },
});
