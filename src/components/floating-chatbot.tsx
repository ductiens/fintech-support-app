import { Feather, Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useChatSessions, useChatHistory, useSendChatMessage, ChatMessage } from "@/src/hooks/use-chat-api";

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

// Helper to parse bold text (**text**)
function parseBoldText(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return text;
  
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <Text key={i} style={styles.boldText}>
          {part}
        </Text>
      );
    }
    return part;
  });
}

// Custom parser to map assistant markdown response to react-native styles
function renderFormattedMessage(content: string) {
  const lines = content.split('\n');
  return (
    <View style={styles.answerBlock}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Check if bullet point
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
          const text = trimmed.substring(1).trim();
          return (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bullet}>·</Text>
              <Text style={styles.paragraph}>{parseBoldText(text)}</Text>
            </View>
          );
        }

        // Check if numbered list
        const matchNumber = trimmed.match(/^(\d+)\.\s(.*)/);
        if (matchNumber) {
          const num = matchNumber[1];
          const text = matchNumber[2];
          return (
            <View key={idx} style={styles.numberRow}>
              <Text style={styles.number}>{num}.</Text>
              <Text style={styles.paragraph}>{parseBoldText(text)}</Text>
            </View>
          );
        }

        // Check if header
        if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
          const text = trimmed.replace(/^#+\s/, '');
          return (
            <Text key={idx} style={styles.sectionTitle}>
              {text}
            </Text>
          );
        }

        // Standard paragraph
        return (
          <Text key={idx} style={styles.paragraph}>
            {parseBoldText(trimmed)}
          </Text>
        );
      })}
    </View>
  );
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { data: sessions, refetch: refetchSessions } = useChatSessions();
  const { data: historyMessages, isLoading: historyLoading } = useChatHistory(currentSessionId);
  const sendMessageMutation = useSendChatMessage();
  
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Sync optimistic messages with history
  useEffect(() => {
    if (historyMessages) {
      setOptimisticMessages(historyMessages);
    } else {
      setOptimisticMessages([]);
    }
  }, [historyMessages, currentSessionId]);

  // Refetch sessions when window opens
  useEffect(() => {
    if (isOpen) {
      refetchSessions();
    }
  }, [isOpen, refetchSessions]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleSend = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;
    const userMsg = message.trim();
    setMessage("");

    // Optimistically render user question
    const userMsgObj: ChatMessage = {
      role: 'user',
      content: userMsg,
      timestamp: new Date().toISOString()
    };
    setOptimisticMessages(prev => [...prev, userMsgObj]);

    try {
      const response = await sendMessageMutation.mutateAsync({
        session_id: currentSessionId,
        message: userMsg,
      });

      if (!currentSessionId && response.session_id) {
        setCurrentSessionId(response.session_id);
      }
    } catch {
      Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
      // Rollback
      setOptimisticMessages(prev => prev.slice(0, -1));
    }
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
            </View>

            {historyLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#062C20" />
                <Text style={styles.loadingText}>Đang tải lịch sử hội thoại...</Text>
              </View>
            ) : (
              <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={scrollToBottom}
              >
                {optimisticMessages.length === 0 ? (
                  <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeSparkle}>✦</Text>
                    <Text style={styles.welcomeTitle}>Xin chào!</Text>
                    <Text style={styles.welcomeSubtitle}>
                      Tôi là VSmart, trợ lý AI hỗ trợ bạn quản lý ví tài chính, kiểm tra số dư và tư vấn bảo mật. Hãy đặt câu hỏi cho tôi bên dưới!
                    </Text>
                  </View>
                ) : (
                  optimisticMessages.map((msg, index) => {
                    if (msg.role === 'user') {
                      return (
                        <View key={index} style={styles.userQuestionBubble}>
                          <Text style={styles.userQuestionText}>{msg.content}</Text>
                        </View>
                      );
                    } else {
                      return (
                        <View key={index} style={styles.assistantAnswerContainer}>
                          <View style={styles.assistantAvatar}>
                            <Text style={styles.avatarSparkle}>✦</Text>
                          </View>
                          <View style={styles.assistantAnswerBubble}>
                            {renderFormattedMessage(msg.content)}
                          </View>
                        </View>
                      );
                    }
                  })
                )}

                {sendMessageMutation.isPending && (
                  <View style={styles.assistantAnswerContainer}>
                    <View style={styles.assistantAvatar}>
                      <Text style={styles.avatarSparkle}>✦</Text>
                    </View>
                    <View style={styles.assistantLoadingBubble}>
                      <ActivityIndicator size="small" color="#062C20" />
                      <Text style={styles.loadingText}>VSmart đang suy nghĩ...</Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}

            {showHistory ? (
              <Pressable style={styles.historyOverlay} onPress={() => setShowHistory(false)}>
                <View style={styles.historyPanel} onStartShouldSetResponder={() => true}>
                  <Text style={styles.historyTitle}>Lịch sử chat</Text>
                  
                  <Pressable
                    style={styles.newChatBtn}
                    onPress={() => {
                      setCurrentSessionId(null);
                      setShowHistory(false);
                    }}
                  >
                    <Feather name="plus" size={16} color="#FFFFFF" />
                    <Text style={styles.newChatBtnText}>Tạo hội thoại mới</Text>
                  </Pressable>

                  <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 8 }} contentContainerStyle={{ paddingBottom: 8 }}>
                    {sessions && sessions.length > 0 ? (
                      sessions.map((h) => (
                        <Pressable
                          key={h.session_id}
                          style={[
                            styles.historyItem,
                            h.session_id === currentSessionId && styles.historyItemActive
                          ]}
                          onPress={() => {
                            setCurrentSessionId(h.session_id);
                            setShowHistory(false);
                          }}
                        >
                          <Text style={styles.historyItemTitle} numberOfLines={1}>
                            {h.title || `Hội thoại #${h.session_id.slice(-5)}`}
                          </Text>
                          <Text style={styles.historyItemPreview}>{formatDate(h.updated_at)}</Text>
                        </Pressable>
                      ))
                    ) : (
                      <Text style={styles.emptyHistoryText}>Chưa có lịch sử hội thoại</Text>
                    )}
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
                <Pressable onPress={handleSend} style={styles.sendButton} disabled={sendMessageMutation.isPending}>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  userQuestionBubble: {
    alignSelf: "flex-end",
    maxWidth: "86%",
    marginBottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
    borderTopRightRadius: 6,
    backgroundColor: "#0B8F6A",
  },
  userQuestionText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  assistantAnswerContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    maxWidth: "88%",
  },
  assistantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#062C20",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSparkle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  assistantAnswerBubble: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  answerBlock: {
    gap: 10,
  },
  sectionTitle: {
    color: "#050505",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    marginTop: 6,
  },
  bulletRow: {
    flexDirection: "row",
    paddingLeft: 8,
    gap: 8,
  },
  bullet: {
    color: "#050505",
    fontSize: 20,
    lineHeight: 22,
  },
  numberRow: {
    flexDirection: "row",
    paddingLeft: 8,
    gap: 8,
  },
  number: {
    color: "#050505",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  paragraph: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  boldText: {
    fontWeight: "900",
    color: "#050505",
  },
  assistantLoadingBubble: {
    flex: 1,
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    flexDirection: "row",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
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
    maxHeight: 340,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: "#111",
  },
  newChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#062C20",
    marginBottom: 10,
  },
  newChatBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  historyItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F4',
    borderRadius: 8,
  },
  historyItemActive: {
    backgroundColor: '#E8F5E9',
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#050505',
  },
  historyItemPreview: {
    fontSize: 12,
    color: '#777C80',
    marginTop: 4,
  },
  emptyHistoryText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 20,
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
    fontSize: 16,
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
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeSparkle: {
    fontSize: 48,
    color: "#0B8F6A",
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5A5D60",
    textAlign: "center",
  },
  loadingText: {
    color: "#062C20",
    fontSize: 14,
    fontWeight: "500",
  },
});
